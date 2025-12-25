import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTasks, mockResults } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function ReportsPage() {
  // Mock aggregation data
  const complianceData = [
    { name: 'Compliant', value: 65, color: 'var(--color-secondary)' },
    { name: 'Minor Issues', value: 25, color: 'var(--color-accent)' },
    { name: 'Non-Compliant', value: 10, color: 'var(--color-destructive)' },
  ];

  const regionPerformance = [
    { name: 'North', score: 88 },
    { name: 'South', score: 72 },
    { name: 'East', score: 94 },
    { name: 'West', score: 65 },
    { name: 'Metro', score: 81 },
  ];

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Overview of campaign performance and compliance metrics.</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full border">
            Last updated: Today, 09:41 AM
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Audits" 
            value="1,248" 
            trend="+12%" 
            trendUp={true} 
            icon={TrendingUp}
            desc="vs. last month"
          />
          <StatsCard 
            title="Avg. Compliance" 
            value="78%" 
            trend="+2.4%" 
            trendUp={true} 
            icon={CheckCircle}
            desc="vs. last month"
          />
          <StatsCard 
            title="Critical Issues" 
            value="24" 
            trend="-5%" 
            trendUp={true} // Good that issues are down
            icon={AlertCircle}
            desc="Requires attention"
            alert
          />
          <StatsCard 
            title="Active Campaigns" 
            value="8" 
            trend="0" 
            trendUp={true} 
            icon={BarChart}
            desc="2 ending soon"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Regional Compliance Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center">
                   {complianceData.map((item) => (
                      <div key={item.name} className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="font-bold text-sm">{item.value}%</span>
                      </div>
                   ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatsCard({ title, value, trend, trendUp, icon: Icon, desc, alert }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className={`p-2 rounded-lg ${alert ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs">
          <span className={`flex items-center font-medium ${trendUp ? 'text-secondary' : 'text-destructive'}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend}
          </span>
          <span className="text-muted-foreground">{desc}</span>
        </div>
      </CardContent>
    </Card>
  )
}
