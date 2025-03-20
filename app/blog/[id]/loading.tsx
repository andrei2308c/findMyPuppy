import { Skeleton } from "@/components/ui/skeleton"
import DesktopLayout from "@/components/desktop/layout"

export default function BlogPostLoading() {
  return (
    <DesktopLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="mb-12">
          <Skeleton className="h-[300px] md:h-[500px] w-full rounded-2xl mb-8" />

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-5/6 mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-4/6 mb-8" />

            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-5/6 mb-4" />
            <Skeleton className="h-6 w-full mb-8" />

            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-3/6 mb-8" />

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesktopLayout>
  )
}

