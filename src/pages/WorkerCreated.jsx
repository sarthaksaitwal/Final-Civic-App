import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function WorkerCreated() {
  const location = useLocation();
  const navigate = useNavigate();
  const worker = location.state?.worker;

  if (!worker) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">No worker data found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">Worker Created Successfully</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-semibold">Name:</span> {worker.name}
            </div>
            <div>
              <span className="font-semibold">Worker ID:</span> {worker.workerId}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {worker.phone}
            </div>
            <div>
              <span className="font-semibold">Department:</span> {worker.department}
            </div>
            <div>
              <span className="font-semibold">Pincode:</span> {worker.pincode}
            </div>
            <Button className="mt-4" onClick={() => navigate("/assign-worker")}>
              Go to Workers List
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}