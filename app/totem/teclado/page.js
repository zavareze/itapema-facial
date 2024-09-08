import Link from 'next/link';
export default function Totem() {
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <div
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
            <div className="mx-auto text-center h-[530px]">
                <img src="https://compre.parquedasaguas.com.br/img/cpa.png" className="mx-auto w-1/3 h-[430px]" />
                <h2 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white">Informe a Placa</h2>
                <p className="mt-2 text-3xl leading-8 text-gray-600 dark:text-slate-300">
                    Digite a Placa do Veículo
                </p>
            </div>
            <div className="rounded-xl border-2 border-black h-[200px] py-8 text-center font-bold shadow-xl text-9xl my-8">
                XXXX-XXXXX
            </div>
            <div className="h-[300px] text-5xl justify-center my-8 p-4 flex flex-wrap">
                <span className="border-2 bg-green-200 rounded-xl p-4 m-4">
                    XXXX-XXXXX
                </span>
                <span className="border-2 bg-green-200 rounded-xl p-4 m-4">
                    XXXX-XXXXX
                </span>
                <span className="border-2 bg-green-200 rounded-xl p-4 m-4">
                    XXXX-XXXXX
                </span>
                <span className="border-2 bg-green-200 rounded-xl p-4 m-4">
                    XXXX-XXXXX
                </span>
                <span className="border-2 bg-green-200 rounded-xl p-4 m-4">
                    XXXX-XXXXX
                </span>
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-10 m-4">
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">1</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">2</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">3</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">4</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">5</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">6</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">7</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">8</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">9</div>
                <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">0</div>
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-10 m-4">
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">Q</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">W</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">E</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">R</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">T</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">Y</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">U</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">I</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">O</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">P</div>
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-9 m-4">
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">A</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">S</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">D</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">F</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">G</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">H</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">J</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">K</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">L</div>
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-9 m-4">
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">Z</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">X</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">C</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">V</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">B</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">N</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center">M</div>
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 col-span-2 border-red-500 flex items-center justify-center">
                    Limpar
                </div>
            </div>

            <div className="rounded-xl bg-indigo-600 p-16 text-center font-semibold text-white shadow-xl text-6xl">
                Próximo
            </div>

            <footer class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
                <div className="text-3xl">
                    Você pode pagar também pelo nosso site, acesse: https://estacionamento.parquedasaguas.com.br
                </div>
                <div className="pt-8 text-xl">
                    <small>Dúvidas Revolution Serviços <a href="//wa.me/5551999926208">(51) 99992-6208</a></small>
                </div>
            </footer>
        </div>
    )
}
