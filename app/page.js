import Link from "next/link";

export default function Selecao() {
  return (
    <div className="isolate bg-white dark:bg-slate-900 px-6 py-8 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <img src="cpa.png" className="w-24 mx-auto" />
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Bem vindo ao Thermas Clube Parque das Águas
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
        Garanta já seu ingresso! Se você é sócio, atualize seus dados para facilitar o reconhecimento facial.
        Compre ou atualize seus ingressos agora e aproveite ao máximo sua experiência no clube!
        </p>
      </div>
      <div className="mx-auto mt-8 max-w-xl sm:mt-20">
      <div className="lg:m-10 mb-10">
          <Link
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/login-socio"
          >
            Sócio
          </Link>
        </div>
        <div className="lg:m-10 mb-10">
          <Link
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/selecione-parque"
          >
            Comprar Ingressos
          </Link>
        </div>
        <div className="lg:m-10 mb-10">
          <Link
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/login-visitante"
          >
            Ver ingressos comprados
          </Link>
        </div>
        <div className="pt-8 text-center">
          <small>
            Dúvidas Revolution Serviços{" "}
            <a href="//wa.me/5551999984008">(51) 99998-4008</a>
          </small>
        </div>
      </div>
    </div>
  );
}
