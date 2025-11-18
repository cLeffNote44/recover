import { forwardRef } from 'react';
import { calculateDaysSober, calculateStreak, getMilestone, calculateTotalSavings } from '@/lib/utils-app';
import { BADGES } from '@/lib/constants';
import type { AppData } from '@/types/app';
import { ReportOptions, getDateRangeDescription, filterByDateRange } from '@/lib/pdf-generator';

interface PDFReportProps {
  data: AppData;
  options: ReportOptions;
}

/**
 * PDF Report Component
 * This component renders a printable/PDF-exportable recovery journey report
 */
export const PDFReport = forwardRef<HTMLDivElement, PDFReportProps>(
  ({ data, options }, ref) => {
    const daysSober = calculateDaysSober(data.sobrietyDate);
    const streak = calculateStreak(data.checkIns);
    const milestone = getMilestone(daysSober);
    const totalSavings = calculateTotalSavings(daysSober, data.costPerDay);

    // Filter data by date range
    const filteredCheckIns = filterByDateRange(data.checkIns, options);
    const filteredCravings = filterByDateRange(data.cravings, options);
    const filteredMeetings = filterByDateRange(data.meetings, options);
    const filteredGrowthLogs = filterByDateRange(data.growthLogs, options);
    const filteredGratitude = filterByDateRange(data.gratitude, options);
    const filteredMeditations = filterByDateRange(data.meditations, options);

    // Calculate stats
    const cravingsOvercome = filteredCravings.filter(c => c.overcame).length;
    const successRate = filteredCravings.length > 0
      ? Math.round((cravingsOvercome / filteredCravings.length) * 100)
      : 0;

    // Get unlocked badges
    const unlockedBadges = BADGES.filter(badge =>
      data.unlockedBadges.includes(badge.id)
    );

    const dateRange = getDateRangeDescription(options);

    return (
      <div ref={ref} className="bg-white text-gray-900 p-12 max-w-4xl mx-auto">
        {/* Cover Page */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4">💪</div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Recover Report
          </h1>
          <p className="text-xl text-gray-600 mb-8">{dateRange}</p>
          <div className="text-sm text-gray-500">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mb-12 border-t-4 border-purple-500 pt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Summary Statistics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg">
              <div className="text-4xl font-bold text-purple-700 mb-2">{daysSober}</div>
              <div className="text-sm font-medium text-gray-700">Days Sober</div>
              <div className="text-xs text-gray-600 mt-1">{milestone.text}</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-700 mb-2">{streak}</div>
              <div className="text-sm font-medium text-gray-700">Check-in Streak</div>
              <div className="text-xs text-gray-600 mt-1">Consecutive days</div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-lg">
              <div className="text-4xl font-bold text-orange-700 mb-2">{successRate}%</div>
              <div className="text-sm font-medium text-gray-700">Success Rate</div>
              <div className="text-xs text-gray-600 mt-1">{cravingsOvercome}/{filteredCravings.length} cravings overcome</div>
            </div>
            {data.costPerDay > 0 && (
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-lg">
                <div className="text-4xl font-bold text-blue-700 mb-2">${totalSavings.toFixed(0)}</div>
                <div className="text-sm font-medium text-gray-700">Money Saved</div>
                <div className="text-xs text-gray-600 mt-1">${data.costPerDay}/day × {daysSober} days</div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Activity Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{filteredCheckIns.length}</div>
              <div className="text-sm text-gray-600">Daily Check-ins</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{filteredMeetings.length}</div>
              <div className="text-sm text-gray-600">Meetings Attended</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{filteredMeditations.length}</div>
              <div className="text-sm text-gray-600">Meditations</div>
            </div>
            <div className="border-l-4 border-pink-500 pl-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{filteredGratitude.length}</div>
              <div className="text-sm text-gray-600">Gratitude Entries</div>
            </div>
          </div>
        </div>

        {/* Badge Achievements */}
        {unlockedBadges.length > 0 && (
          <div className="mb-12 page-break-before">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Badge Achievements</h2>
            <div className="grid grid-cols-3 gap-4">
              {unlockedBadges.map(badge => (
                <div key={badge.id} className="border-2 border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-sm text-gray-900">{badge.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Logs */}
        {options.includeGrowthLogs && filteredGrowthLogs.length > 0 && (
          <div className="mb-12 page-break-before">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Growth & Learning</h2>
            <div className="space-y-4">
              {filteredGrowthLogs.slice(0, 10).map(log => (
                <div key={log.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                  <div className="font-semibold text-gray-900">{log.title}</div>
                  <div className="text-sm text-gray-700 mt-1">{log.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gratitude Entries */}
        {options.includeGratitude && filteredGratitude.length > 0 && (
          <div className="mb-12 page-break-before">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Gratitude Journal</h2>
            <div className="space-y-3">
              {filteredGratitude.slice(0, 15).map(entry => (
                <div key={entry.id} className="border-l-4 border-pink-500 pl-4 py-2">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-700">{entry.entry}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Craving Analysis */}
        {filteredCravings.length > 0 && (
          <div className="mb-12 page-break-before">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Craving Analysis</h2>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Top Triggers</h3>
              <div className="space-y-2">
                {Object.entries(
                  filteredCravings.reduce((acc, craving) => {
                    acc[craving.trigger] = (acc[craving.trigger] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([trigger, count]) => (
                    <div key={trigger} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-gray-900">{trigger}</span>
                      <span className="font-semibold text-gray-700">{count} times</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-700">
                <strong>Average Intensity:</strong>{' '}
                {filteredCravings.length > 0
                  ? (
                      filteredCravings.reduce((sum, c) => sum + c.intensity, 0) /
                      filteredCravings.length
                    ).toFixed(1)
                  : 0}
                /10
              </div>
            </div>
          </div>
        )}

        {/* Reasons for Sobriety */}
        {data.reasonsForSobriety.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Why</h2>
            <div className="space-y-3">
              {data.reasonsForSobriety.map(reason => (
                <div key={reason.id} className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-gray-900">{reason.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t-2 border-gray-200 text-center text-sm text-gray-500">
          <p>Generated by Recover App</p>
          <p className="mt-2">Keep going. One day at a time. 💪</p>
        </div>

        {/* CSS for printing */}
        <style>{`
          @media print {
            .page-break-before {
              page-break-before: always;
            }
          }
        `}</style>
      </div>
    );
  }
);

PDFReport.displayName = 'PDFReport';
