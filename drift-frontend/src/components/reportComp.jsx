import React, { useEffect, useState } from "react";
import { getReportById } from "../api/reportapi";
import { useParams } from "react-router-dom";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, Filter } from "lucide-react";

const ReportComp = () => {
  const { projectId } = useParams();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      if (!projectId) return;

      try {
        const data = await getReportById(projectId);
        console.log("Fetched data:", data); // Debug log
        setReports(data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [projectId]);

  const getSeverityConfig = (severity) => {
    const configs = {
      high: {
        bg: "bg-red-950/40",
        border: "border-red-900/60",
        text: "text-red-400",
        icon: XCircle,
        label: "High Severity",
      },
      medium: {
        bg: "bg-orange-950/40",
        border: "border-orange-900/60",
        text: "text-orange-400",
        icon: AlertTriangle,
        label: "Medium Severity",
      },
      low: {
        bg: "bg-yellow-950/40",
        border: "border-yellow-900/60",
        text: "text-yellow-400",
        icon: AlertCircle,
        label: "Low Severity",
      },
      none: {
        bg: "bg-emerald-950/40",
        border: "border-emerald-900/60",
        text: "text-emerald-400",
        icon: CheckCircle,
        label: "All Clear",
      },
    };
    return configs[severity?.toLowerCase()] || configs.none;
  };

  const parseIssue = (issueString) => {
    try {
      // Handle if it's already an object
      if (typeof issueString === 'object') {
        return issueString;
      }
      
      const cleaned = issueString
        .replace(/new ObjectId\([^)]+\)/g, '""')
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Error parsing issue:", error, issueString);
      return null;
    }
  };

  // Filter reports based on selected severity
  const getFilteredReports = () => {
    if (selectedSeverity === "all") {
      return reports;
    }
    return reports.filter(
      (report) => report.severity?.toLowerCase() === selectedSeverity
    );
  };

  const filteredReports = getFilteredReports();

  // Get counts for each severity
  const severityCounts = {
    all: reports.length,
    high: reports.filter((r) => r.severity?.toLowerCase() === "high").length,
    medium: reports.filter((r) => r.severity?.toLowerCase() === "medium").length,
    low: reports.filter((r) => r.severity?.toLowerCase() === "low").length,
  };

  const renderReportCard = (report) => {
    const severityConfig = getSeverityConfig(report.severity);
    const Icon = severityConfig.icon;
    const hasIssues = report.issues && report.issues.length > 0;

    console.log("Rendering report:", report); // Debug log
    console.log("Issues array:", report.issues); // Debug log

    return (
      <div
        key={report._id}
        className={`border ${severityConfig.border} ${severityConfig.bg} rounded-lg overflow-hidden`}
      >
        {/* Header */}
        <div className="bg-zinc-900/50 border-b border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <code className="text-base font-semibold text-white bg-zinc-800 px-3 py-1.5 rounded">
              {report.endpoint}
            </code>
            <div className={`flex items-center gap-2 ${severityConfig.text}`}>
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm uppercase tracking-wide">
                {severityConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {hasIssues ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-zinc-300">
                  Issues Found
                </h4>
                <span className="bg-zinc-800 text-zinc-300 text-xs font-medium px-2.5 py-1 rounded">
                  {report.issues.length} {report.issues.length === 1 ? "Issue" : "Issues"}
                </span>
              </div>
              
              {/* Display each issue from the issues array */}
              {report.issues.map((issue, idx) => {
                const parsed = parseIssue(issue);
                
                console.log(`Issue ${idx}:`, issue); // Debug log
                console.log(`Parsed issue ${idx}:`, parsed); // Debug log
                
                if (!parsed) {
                  // If parsing fails, show raw issue
                  return (
                    <div
                      key={idx}
                      className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-4"
                    >
                      <p className="text-xs font-medium text-red-400 mb-2">
                        Issue #{idx + 1} (Raw Data - Parsing Failed)
                      </p>
                      <pre className="text-xs text-zinc-400 whitespace-pre-wrap break-words">
                        {typeof issue === 'string' ? issue : JSON.stringify(issue, null, 2)}
                      </pre>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-4 space-y-3"
                  >
                    {/* Issue Number and Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-700">
                      <span className="text-xs font-bold text-zinc-400">
                        Issue #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${severityConfig.text} border ${severityConfig.border}`}>
                          {parsed.severity}
                        </span>
                        <span className="text-xs text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded font-mono">
                          {parsed.type}
                        </span>
                      </div>
                    </div>
                    
                    {/* Issue Message */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
                      <p className="text-xs font-medium text-zinc-500 mb-1.5">
                        Issue Description:
                      </p>
                      <p className="text-sm text-white leading-relaxed">
                        {parsed.message}
                      </p>
                    </div>

                    {/* Affected Field */}
                    {parsed.field && (
                      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
                        <p className="text-xs font-medium text-zinc-500 mb-1.5">
                          Affected Field:
                        </p>
                        <code className="text-sm text-emerald-400 bg-zinc-950 px-2.5 py-1.5 rounded inline-block font-mono border border-emerald-900/30">
                          {parsed.field}
                        </code>
                      </div>
                    )}

                    {/* Timestamp */}
                    {parsed.createdAt && (
                      <div className="pt-2 border-t border-zinc-800">
                        <p className="text-xs text-zinc-600">
                          Detected: {new Date(parsed.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">All checks passed - No issues found</p>
            </div>
          )}

          {/* Report Metadata */}
          <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600">
            Report created: {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center pt-12 pb-20 px-4">
      <div className="w-full max-w-5xl space-y-6">
        
        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Pipeline Security Report
          </h1>
          <p className="text-zinc-400 text-sm">
            Project ID: <span className="text-zinc-300 font-mono">{projectId}</span>
          </p>
        </div>

        {/* Filter Tabs */}
        {!loading && reports.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex gap-2">
            <button
              onClick={() => setSelectedSeverity("all")}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                selectedSeverity === "all"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" />
                All Issues
                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs">
                  {severityCounts.all}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedSeverity("high")}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                selectedSeverity === "high"
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                High
                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs">
                  {severityCounts.high}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedSeverity("medium")}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                selectedSeverity === "medium"
                  ? "bg-orange-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Medium
                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs">
                  {severityCounts.medium}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedSeverity("low")}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                selectedSeverity === "low"
                  ? "bg-yellow-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Low
                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs">
                  {severityCounts.low}
                </span>
              </div>
            </button>
          </div>
        )}

        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center">
            <div className="animate-pulse flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-zinc-400">Loading reports...</p>
            </div>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center">
            <p className="text-zinc-400">No reports found for this project</p>
          </div>
        )}

        {!loading && filteredReports.length === 0 && reports.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center">
            <p className="text-zinc-400">No {selectedSeverity} severity issues found</p>
          </div>
        )}

        {!loading && filteredReports.length > 0 && (
          <div className="space-y-4">
            {filteredReports.map(renderReportCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportComp;