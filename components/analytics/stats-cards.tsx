"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Key } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface StatsCardsProps {
  totalElements: number
  averageStrength: number
}

export function StatsCards({ totalElements, averageStrength }: StatsCardsProps) {
  const maxElements = 100 // Ajusta este valor según tu máximo esperado
  const remainingElements = Math.max(maxElements - totalElements, 0)

  const elementData = [
    { name: 'Total Elements', value: totalElements },
    { name: 'Remaining', value: remainingElements },
  ]

  const strengthData = [
    { name: 'Strength', value: averageStrength },
    { name: 'Remaining', value: 100 - averageStrength },
  ]

  // Paleta de colores vibrante
  const COLORS = ['#2563EB', '#60A8FB', '#45B7D1', '#FFA07A', '#98D8C8']

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Elements</CardTitle>
          <Key className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={elementData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {elementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-2xl font-bold text-white">{totalElements}</div>
          <p className="text-xs text-blue-100">
            Stored passwords and elements
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-400 to-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Password Security</CardTitle>
          <Shield className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={strengthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {strengthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-2xl font-bold text-white">{averageStrength.toFixed(1)}%</div>
          <p className="text-xs text-green-100">
            Average password strength
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

