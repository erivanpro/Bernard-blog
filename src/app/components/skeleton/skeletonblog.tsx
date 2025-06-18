export default function BlogLoadingSkeleton() {
  return (
    <div className="bg-white py-24 sm:py-32 mx-2 animate-pulse">
      <div className="mx-auto px-6 lg:px-8">
        {/* En-tête + tri */}
        <div className="mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-3 w-64">
            <div className="h-12 bg-gray-300 rounded-md" />
            <div className="h-5 bg-gray-200 rounded-md w-5/6" />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-5 w-20 bg-gray-300 rounded" />
            <div className="h-8 w-28 bg-gray-300 rounded-md" />
          </div>
        </div>

        {/* Filtres catégorie */}
        <div className="mt-6 flex overflow-x-auto space-x-4 no-scrollbar snap-x snap-mandatory">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-md px-4 py-2 text-sm font-semibold whitespace-nowrap snap-start bg-gray-200 text-transparent select-none"
            >
              Loading
            </div>
          ))}
        </div>

        {/* Grille des articles */}
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-300 px-8 pt-80 pb-8 items-center text-center lg:items-start lg:text-left"
            >
              <div className="absolute inset-0 -z-10 bg-gray-400 rounded-2xl" />
              <div className="absolute top-8 left-8 rounded-full px-3 py-1 text-xs font-semibold text-transparent border border-transparent bg-gray-400 backdrop-blur-sm select-none">
                &nbsp;
              </div>

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-400 mt-6 w-full justify-center lg:justify-start">
                <div className="h-4 w-20 bg-gray-400 rounded mr-8" />
                <div className="h-6 w-6 rounded-full bg-gray-400" />
                <div className="h-4 w-28 bg-gray-400 rounded ml-2" />
              </div>

              <div className="mt-3 h-7 w-40 bg-gray-400 rounded" />
              <div className="mt-2 h-5 w-56 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav
          className="mt-12 flex justify-center gap-2 text-sm font-medium text-gray-400 select-none"
          aria-label="Pagination"
        >
          <div className="rounded-md px-3 py-1 bg-gray-300 opacity-50 cursor-not-allowed">Précédent</div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-md px-3 py-1 bg-gray-300"
            >
              &nbsp;
            </div>
          ))}
          <div className="rounded-md px-3 py-1 bg-gray-300 opacity-50 cursor-not-allowed">Suivant</div>
        </nav>
      </div>
    </div>
  );
}
