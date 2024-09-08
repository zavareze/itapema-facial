import Link from 'next/link';
export default function Totem() {
  return (
    <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto text-center h-3/6 h-[1100px]">
        <img src="https://compre.parquedasaguas.com.br/img/cpa.png" className="mx-auto w-9/12  h-[966px]" />
        <h2 className="text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">Pagamento Estacionamento</h2>
        <p className="mt-2 text-4xl leading-8 text-gray-600 dark:text-slate-300 mx-4">
          Efetue seu pagamento do estacionamento aqui ou pelo nosso site.
        </p>
      </div>
      <div className="">
            <Link href="/totem/socio">
                <div className="rounded-xl bg-indigo-600 p-16 text-center font-bold text-white shadow-xl text-8xl my-8">
                  Sou Sócio
                </div>
            </Link>
            <Link
              href="/totem/visitante">
              <div className="rounded-xl bg-indigo-600 p-16 text-center font-bold text-white shadow-xl text-8xl my-8">
                  Sou Visitante
                </div>
            </Link>
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
