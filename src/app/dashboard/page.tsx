export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          ברוך הבא ל-FINBAR
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          מערכת ניהול תיקי ההשקעות שלך
        </p>
        <div className="mt-8 rounded-lg border border-dashed border-border p-12">
          <p className="text-muted-foreground">
            תיקי ההשקעות שלך יופיעו כאן
          </p>
        </div>
      </div>
    </div>
  )
}
