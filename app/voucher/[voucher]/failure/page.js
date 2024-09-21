import Link from "next/link";


export default async function Failure(req) {
    // console.log(req);
    return (
        <div className="isolate bg-white px-6 py-8 sm:py-32 lg:px-8">
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
                <img src="/cpa.png" className="w-24 mx-auto" />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                    Retorno Operadora Cartão (Falha)
                </h2>
            </div>
            <h2 className="text-xl font-bold mb-2 text-black">Voucher {req.params.voucher}</h2>
            <hr />
            <div className="my-4 text-black">
                <h2 className="text-xl font-bold mt-4 text-center pb-4">Não foi possível processar a sua compra no cartão.</h2>
                <div className="text-sm pb-4">Abaixo o erro informado pela operadora.</div>
                <div className="bg-red-100 rounded text-center p-4">{req.searchParams.errorCode} - {req.searchParams.message}</div>
                <div className="bg-red-100 rounded text-center p-4">{req.searchParams.errorCode3DS} - {req.searchParams.message3DS}</div>
            </div>
            <div className="m-4">
                <Link href="/selecione-parque"
                    className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Voltar
                </Link>
            </div>
            <div className="pt-8 text-center">
                <small>
                    Dúvidas Revolution Serviços{" "}
                    <a href="//wa.me/5551999926208">(51) 99992-6208</a>
                </small>
            </div>
        </div>
    );
}
