import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';

// Demo activity types as simple strings
type ActivityType =
  | 'SIGN_UP'
  | 'SIGN_IN'
  | 'SIGN_OUT'
  | 'UPDATE_PASSWORD'
  | 'DELETE_ACCOUNT'
  | 'UPDATE_ACCOUNT'
  | 'CREATE_TEAM'
  | 'REMOVE_TEAM_MEMBER'
  | 'INVITE_TEAM_MEMBER'
  | 'ACCEPT_INVITATION';

// Map activity type to icon
const iconMap: Record<ActivityType, LucideIcon> = {
  SIGN_UP: UserPlus,
  SIGN_IN: UserCog,
  SIGN_OUT: LogOut,
  UPDATE_PASSWORD: Lock,
  DELETE_ACCOUNT: UserMinus,
  UPDATE_ACCOUNT: Settings,
  CREATE_TEAM: UserPlus,
  REMOVE_TEAM_MEMBER: UserMinus,
  INVITE_TEAM_MEMBER: Mail,
  ACCEPT_INVITATION: CheckCircle,
};

// Demo activity logs
const demoLogs = [
  { id: 1, action: 'SIGN_UP' as ActivityType, ipAddress: '192.168.0.1', timestamp: new Date(Date.now() - 3600 * 1000) },
  { id: 2, action: 'SIGN_IN' as ActivityType, ipAddress: '192.168.0.2', timestamp: new Date(Date.now() - 1800 * 1000) },
  { id: 3, action: 'UPDATE_ACCOUNT' as ActivityType, ipAddress: '', timestamp: new Date(Date.now() - 600 * 1000) },
  { id: 4, action: 'INVITE_TEAM_MEMBER' as ActivityType, ipAddress: '10.0.0.5', timestamp: new Date(Date.now() - 300 * 1000) },
];

// Relative time helper
function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

// Format action text
function formatAction(action: ActivityType): string {
  switch (action) {
    case 'SIGN_UP': return 'You signed up';
    case 'SIGN_IN': return 'You signed in';
    case 'SIGN_OUT': return 'You signed out';
    case 'UPDATE_PASSWORD': return 'You changed your password';
    case 'DELETE_ACCOUNT': return 'You deleted your account';
    case 'UPDATE_ACCOUNT': return 'You updated your account';
    case 'CREATE_TEAM': return 'You created a new team';
    case 'REMOVE_TEAM_MEMBER': return 'You removed a team member';
    case 'INVITE_TEAM_MEMBER': return 'You invited a team member';
    case 'ACCEPT_INVITATION': return 'You accepted an invitation';
    default: return 'Unknown action occurred';
  }
}

export default function ActivityPage() {
  const logs = demoLogs; // Use demo data

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Activity Log
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action] || Settings;
                const formattedAction = formatAction(log.action);

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formattedAction}
                        {log.ipAddress && ` from IP ${log.ipAddress}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                When you perform actions like signing in or updating your
                account, they'll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
