import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthCard({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}