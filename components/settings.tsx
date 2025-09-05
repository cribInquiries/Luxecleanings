"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  SettingsIcon,
  Bell,
  Shield,
  Calendar,
  Database,
  Code,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: false,
      conflictAlerts: true,
      syncFailures: true,
      weeklyReports: false,
    },
    calendar: {
      defaultView: "month",
      weekStartsOn: "sunday",
      timezone: "America/Los_Angeles",
      autoSync: true,
      syncInterval: "15",
      conflictResolution: "manual",
    },
    ical: {
      validateFeeds: true,
      autoRetry: true,
      retryAttempts: "3",
      cacheTimeout: "60",
      enableLogging: true,
      strictValidation: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "24",
      apiAccess: true,
      auditLogging: true,
    },
  })

  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values.",
    })
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2">
          <SettingsIcon className="h-4 w-4" />
          Configure your property management and iCal integration preferences
        </p>
      </div>

      <div className="grid gap-6 lg:gap-8">
        {/* Notifications */}
        <Card className="bg-white/50 backdrop-blur border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage how and when you receive alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Email Alerts</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailAlerts}
                  onCheckedChange={(checked) => updateSetting("notifications", "emailAlerts", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Push Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Browser push notifications for real-time updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Conflict Alerts</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Notify when booking conflicts are detected</p>
                </div>
                <Switch
                  checked={settings.notifications.conflictAlerts}
                  onCheckedChange={(checked) => updateSetting("notifications", "conflictAlerts", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Sync Failures</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Alert when iCal feed synchronization fails</p>
                </div>
                <Switch
                  checked={settings.notifications.syncFailures}
                  onCheckedChange={(checked) => updateSetting("notifications", "syncFailures", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Weekly Reports</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receive weekly summary reports via email</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => updateSetting("notifications", "weeklyReports", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Settings */}
        <Card className="bg-white/50 backdrop-blur border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Calendar Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Customize calendar display and synchronization behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Default View</Label>
                  <Select
                    value={settings.calendar.defaultView}
                    onValueChange={(value) => updateSetting("calendar", "defaultView", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Week Starts On</Label>
                  <Select
                    value={settings.calendar.weekStartsOn}
                    onValueChange={(value) => updateSetting("calendar", "weekStartsOn", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Timezone</Label>
                <Select
                  value={settings.calendar.timezone}
                  onValueChange={(value) => updateSetting("calendar", "timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Auto-Sync</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Automatically synchronize external calendar feeds
                  </p>
                </div>
                <Switch
                  checked={settings.calendar.autoSync}
                  onCheckedChange={(checked) => updateSetting("calendar", "autoSync", checked)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Sync Interval (minutes)</Label>
                  <Select
                    value={settings.calendar.syncInterval}
                    onValueChange={(value) => updateSetting("calendar", "syncInterval", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Conflict Resolution</Label>
                  <Select
                    value={settings.calendar.conflictResolution}
                    onValueChange={(value) => updateSetting("calendar", "conflictResolution", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Review</SelectItem>
                      <SelectItem value="newest">Keep Newest</SelectItem>
                      <SelectItem value="external">Prefer External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* iCal.NET Integration Settings */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900 text-base sm:text-lg">
              <Code className="h-4 w-4 sm:h-5 sm:w-5" />
              iCal.NET Integration
            </CardTitle>
            <CardDescription className="text-indigo-700 text-xs sm:text-sm">
              Configure iCal parsing, validation, and processing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base text-indigo-900">Validate Feeds</Label>
                  <p className="text-xs sm:text-sm text-indigo-700">
                    Use iCal.NET to validate feed format before importing
                  </p>
                </div>
                <Switch
                  checked={settings.ical.validateFeeds}
                  onCheckedChange={(checked) => updateSetting("ical", "validateFeeds", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base text-indigo-900">Auto Retry</Label>
                  <p className="text-xs sm:text-sm text-indigo-700">Automatically retry failed sync operations</p>
                </div>
                <Switch
                  checked={settings.ical.autoRetry}
                  onCheckedChange={(checked) => updateSetting("ical", "autoRetry", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base text-indigo-900">Strict Validation</Label>
                  <p className="text-xs sm:text-sm text-indigo-700">Enable strict RFC 5545 compliance checking</p>
                </div>
                <Switch
                  checked={settings.ical.strictValidation}
                  onCheckedChange={(checked) => updateSetting("ical", "strictValidation", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base text-indigo-900">Enable Logging</Label>
                  <p className="text-xs sm:text-sm text-indigo-700">Log iCal parsing operations for debugging</p>
                </div>
                <Switch
                  checked={settings.ical.enableLogging}
                  onCheckedChange={(checked) => updateSetting("ical", "enableLogging", checked)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base text-indigo-900">Retry Attempts</Label>
                  <Select
                    value={settings.ical.retryAttempts}
                    onValueChange={(value) => updateSetting("ical", "retryAttempts", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base text-indigo-900">Cache Timeout (minutes)</Label>
                  <Select
                    value={settings.ical.cacheTimeout}
                    onValueChange={(value) => updateSetting("ical", "cacheTimeout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* iCal.NET Status */}
              <div className="p-3 sm:p-4 bg-indigo-100 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-indigo-900 text-sm sm:text-base">iCal.NET Status</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-indigo-800">
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                    <span>Library Status</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-800">
                    <Badge variant="default" className="text-xs">
                      v4.2.0
                    </Badge>
                    <span>Version</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-800">
                    <Badge variant="default" className="text-xs">
                      RFC 5545
                    </Badge>
                    <span>Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white/50 backdrop-blur border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage security settings and data privacy options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Two-Factor Authentication</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting("security", "twoFactorAuth", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">API Access</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Allow third-party applications to access your data
                  </p>
                </div>
                <Switch
                  checked={settings.security.apiAccess}
                  onCheckedChange={(checked) => updateSetting("security", "apiAccess", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base">Audit Logging</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Keep detailed logs of all account activities
                  </p>
                </div>
                <Switch
                  checked={settings.security.auditLogging}
                  onCheckedChange={(checked) => updateSetting("security", "auditLogging", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Session Timeout (hours)</Label>
                <Select
                  value={settings.security.sessionTimeout}
                  onValueChange={(value) => updateSetting("security", "sessionTimeout", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/50 backdrop-blur border-slate-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
              Data Management
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Import, export, and manage your calendar data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="bg-white/70 text-sm sm:text-base">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="bg-white/70 text-sm sm:text-base">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm sm:text-base">Backup & Restore</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-white/70 text-sm sm:text-base">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline" className="bg-white/70 text-sm sm:text-base">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-900 text-sm sm:text-base">Data Retention</h4>
                    <p className="text-xs sm:text-sm text-amber-800 mt-1">
                      Calendar data is automatically backed up daily. Deleted events are retained for 30 days before
                      permanent removal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button onClick={handleSave} className="flex-1 text-sm sm:text-base">
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex-1 bg-white/70 text-sm sm:text-base">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  )
}
