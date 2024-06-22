'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
export default function Selecao() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [parque, setParque] = useState(searchParams.get('parque'));
    const [data, setData] = useState(searchParams.get('data'));
    const [calendario, setCalendario] = useState([]);
    const [mes, setMes] = useState(0);
    const [calendarioAtual, setCalendarioAtual] = useState([]);
    useEffect(() => {
        let ignore = false;
        const getCalendario = async () => {
            const res = await fetch(`https://facial.parquedasaguas.com.br/ingressos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await res.json();
            if (!ignore) {
                console.log(result);
                setCalendario(result['mes']);
                setCalendarioAtual(result['mes'][0]);
            }
        }
        getCalendario();
        return () => {
            ignore = true;
        }
    }, []);
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
                    Promoções Disponíveis
                </h2>
            </div>
            <h2 className="text-xl font-bold mb-2 text-black">Ingresso para 1 dia (Day Use)</h2>
            <div className="text-black">
                <div className="font-bold text-md mb-2">
                    Ingresso Adulto <span className="text-blue-900 font-normal">(+info)</span>
                </div>
                <div className="flex mb-2">
                    <div className="font-bold mx-4 text-xl">R$ 79,90</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center cursor-pointer">-</div>
                    <div className="border mx-2 px-2 w-16 text-center">0</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center cursor-pointer">+</div>
                </div>
            </div>
            <div className="text-black">
                <div className="font-bold text-black text-md mb-2">
                    Ingresso Criança <span className="text-blue-900 font-normal">(2 a 9 anos e 11 meses)</span>
                </div>
                <div className="flex mb-2">
                    <div className="font-bold mx-4 text-xl">R$ 59,90</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">-</div>
                    <div className="border mx-2 px-2 w-16 text-center">0</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">+</div>
                </div>
            </div>
            <div className="text-black mb-4">
                <div className="font-bold text-md mb-2">
                    Estacionamento (1 por veículo)
                </div>
                <div className="flex mb-2">
                    <div className="font-bold mx-4 text-xl">R$ 25,00</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">-</div>
                    <div className="border mx-2 px-2 w-16 text-center">0</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">+</div>
                </div>
            </div>

            { parque == '2' ? (<div className="mt-8 mb-4 text-black">
                <div className="font-bold text-md mb-2">
                    Temporada Individual VIPCARD 1 ano
                </div>
                <div className="text-sm mb-2">Tenha seu acesso individual liberado no parque aquático de viamão durante 1 ano e ainda ganhe desconto no estacionamento, 
                adquira já seu VIPCARD.</div>
                <div className="flex mb-2">
                    <div className="font-bold mx-4 text-xl">R$ 275,00</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">-</div>
                    <div className="border mx-2 px-2 w-16 text-center">0</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">+</div>
                </div>
            </div>) : ''}

            <hr />

            <div className="my-4 text-black">
                <h2 className="text-xl font-bold mt-4">Ingresso Especiais</h2>
                <div className="text-sm">Apresente documentação comprobatória para obter o benefício.</div>
            </div>
            <div className="text-black">
                <div className="font-bold text-md mb-2">
                    Ingresso Idoso (+65 anos)
                </div>
                <div className="flex mb-2">
                    <div className="font-bold mx-4 text-xl">R$ 59,90</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">-</div>
                    <div className="border mx-2 px-2 w-16 text-center">0</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">+</div>
                </div>
            </div>
            <div className="text-black">
                <div className="font-bold text-md mb-2">
                    Ingresso Pessoa com Deficiência (PCD)
                </div>
                <div className="flex mb-2">
                    <div className="font-bold mx-4 text-xl">R$ 59,90</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">-</div>
                    <div className="border mx-2 px-2 w-16 text-center">0</div>
                    <div className="rounded-full border bg-slate-100 w-8 px-2 text-center">+</div>
                </div>
            </div>
            

            <div className="m-4">
                <div
                    className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => router.back()}
                >
                    Voltar
                </div>
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
