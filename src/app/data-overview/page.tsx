export default function Page() {
  return (
    <main className="grid min-h-full place-items-center bg-white py-28 px-auto sm:py-32 lg:py-18 pl-0 lg:pl-80">
      <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
            Data Overview
          </h2>
          <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
              <figure className="border-l border-blue-600 pl-8">
                <blockquote className="text-lg font-medium leading-8 tracking-tight text-gray-900">
                  <p className="leading-8 text-gray-600">
                    Based on water isotope observations from 62 stations that we collected from
                    September 2010 to September 2017, we managed to build monthly δ2H, δ18O, and
                    d-excess datasets per station and for all IMC, which are shared openly,
                    accessible, and easily updated on the GitHub repository. We have also performed
                    quality control on these data by calculating the LMWL using BLR, which is under
                    the range of slopes and intercepts in previous studies conducted in areas with
                    similar climate types (e. g. He et al., 2018a,b; Putman et al., 2019; He et al.,
                    2021). The open data we shared are by far the most complete data over the IMC
                    for stable isotopes of precipitation.
                  </p>
                </blockquote>
              </figure>
              <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                <p>
                  There are limitations to this study. One of them is that we should have checked
                  the amount effect. This is due to the limitation of station precipitation data,
                  which contains many empty data. In addition, this monthly water isotope
                  observation activities over the IMC were stopped in September 2017. This activity
                  should be continued, given the central position of the IMC in the Earth’s climate
                  system, which is currently undergoing significant changes as a consequence of the
                  unprecedented increase in anthropogenic radiative forcing. The study of water
                  isotopes in precipitation over the IMC can undoubtedly deepen our understanding of
                  anthropogenic and natural attributions in the hydrologic cycle in the tropics.
                </p>
                <figure className="mt-10 border-t border-gray-300 pt-4">
                  <p>
                    This study was supported by ITB Research, Community Service and Innovation
                    Program (PPMI-ITB 2022) and Japan Society for the Promotion of Science (JSPS)
                    KAKENHI (#24510256 and #16H05619).
                  </p>
                </figure>

                <p className="mt-10 text-sm">
                  App Version: 1.0
                  <br />
                  2023 © ITB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
