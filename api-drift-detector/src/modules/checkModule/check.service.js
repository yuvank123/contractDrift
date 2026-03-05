import CheckRun from "../../models/checkRun.model.js";

import { parseContractService } from "../contractModule/contract.service.js";
import { runEndpoints } from "../runnerModule/runner.service.js";
import { validateEndpointResponse } from "../validationModule/validation.service.js";
import { detectDrift } from "../driftModule/drift.service.js";
import { createReport } from "../reportsModule/report.service.js";

export async function runCheck({ filePath, baseUrl, projectId }) {

    const startedAt = new Date();

    // create check run entry
    const checkRun = await CheckRun.create({
        projectId,
        startedAt
    });

    // 1️parse contract
    const { endpoints } = await parseContractService({
        filePath,
        projectId
    });

    // 2 run endpoints
    const results = await runEndpoints(baseUrl, endpoints);

    const reports = [];
    let driftDetected = false;

    for (const result of results) {

        // find schema from endpoint responses
        const endpointContract = endpoints.find(
            e => e.path === result.endpoint && e.method === result.method
        );

        const schema =
            endpointContract?.responses?.["200"]?.schema || {};

        // 3️ validate response
        const validation = validateEndpointResponse(
            schema,
            result.data || {}
        );

        // 4️ detect drift
        const drift = await detectDrift(validation);

        if (drift.drift) {
            driftDetected = true;
        }

        // 5️ save report
        const report = await createReport({
            projectId,
            endpoint: result.endpoint,
            severity: drift.drift ? "high" : "low",
            issues: drift.issues
        });

        reports.push(report);

    }

    // finish check run
    checkRun.finishedAt = new Date();
    checkRun.driftDetected = driftDetected;

    await checkRun.save();

    return {
        checkRun,
        reports
    };

}