"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getNotificationsAndPasswordSecurity } from "@/actions/notifications";
import { AlertTriangle, ShieldAlert, Lock } from "lucide-react";
import Loading from "@/components/loading";

export default function NotificationsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNotificationsAndPasswordSecurity();
      setData(result);
    };
    fetchData();
  }, []);

  if (!data)
    return (
      <div>
        <Loading />
      </div>
    );

  const securePasswordPercentage =
    ((data.totalPasswords - data.weakPasswords) / data.totalPasswords) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Notifications & Security</h1>

      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Password Security Overview</CardTitle>
          <CardDescription className="text-purple-100">
            Your account's password health at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">
              {securePasswordPercentage.toFixed(1)}%
            </div>
            <Badge
              variant={
                securePasswordPercentage > 70 ? "default" : "destructive"
              }
              className="text-sm"
            >
              {securePasswordPercentage > 70 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
          <Progress value={securePasswordPercentage} className="h-2 mb-2" />
          <p className="text-sm text-purple-100">
            {data.weakPasswords} out of {data.totalPasswords} passwords need
            attention
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {data.notifications.map((notification: any) => (
          <Alert
            key={notification.id}
            variant={
              notification.type === "warning" ? "destructive" : "default"
            }
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        ))}
      </div>

      {data.notifications.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2" />
              All Secure
            </CardTitle>
            <CardDescription>
              Great job! Your passwords are currently secure.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
