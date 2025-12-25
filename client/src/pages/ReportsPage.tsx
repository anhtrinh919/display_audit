import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTasks, mockResults } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function ReportsPage() {
  // Mock aggregation data
  const complianceData = [
    { name: 'Đạt', value: 65, color: 'var(--color-secondary)' },
    { name: 'Cần cải thiện', value: 25, color: 'var(--color-accent)' },
    { name: 'Không Đạt', value: 10, color: 'var(--color-destructive)' },
  ];

  const regionPerformance = [
    { name: 'Miền Bắc', score: 88 },
    { name: 'Miền Nam', score: 72 },
    { name: 'Miền Trung', score: 94 },
    { name: 'Miền Tây', score: 65 },
    { name: 'TP.HCM', score: 81 },
  ];

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Tổng quan</h1>
            <p className="text-muted-foreground">Báo cáo hiệu suất chiến dịch và chỉ số tuân thủ.</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full border">
            Cập nhật lần cuối: Hôm nay, 09:41 AM
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Tổng số lượt kiểm tra" 
            value="1,248" 
            trend="+12%" 
            trendUp={true} 
            icon={TrendingUp}
            desc="so với tháng trước"
          />
          <StatsCard 
            title="Tỷ lệ Tuân thủ TB" 
            value="78%" 
            trend="+2.4%" 
            trendUp={true} 
            icon={CheckCircle}
            desc="so với tháng trước"
          />
          <StatsCard 
            title="Lỗi Nghiêm trọng" 
            value="24" 
            trend="-5%" 
            trendUp={true} // Good that issues are down
            icon={AlertCircle}
            desc="Cần xử lý ngay"
            alert
          />
          <StatsCard 
            title="Chiến dịch Hoạt động" 
            value="8" 
            trend="0" 
            trendUp={true} 
            icon={BarChart}
            desc="2 sắp kết thúc"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Hiệu suất theo Khu vực</CardTitle>
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
              <CardTitle>Phân bổ Vấn đề</CardTitle>
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
