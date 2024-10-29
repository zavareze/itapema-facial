'use client';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function Totem() {
    const router = useRouter();
    const [valor, setValor] = useState('');
    useEffect(() => {
        setValor(localStorage.getItem('trnAmount'));
    }, []);
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <Header title="Escolha a Forma de Pagamento" caption="Aceitamos Cartões de Débito, Crédito e PIX." />
            <div className="text-8xl font-bold text-center border rounded-xl p-4 bg-green-100 my-16 py-8">
                Valor: R$ {parseFloat(valor)?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 w-full mb-8">
                <div className="rounded-xl bg-green-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                onClick={() => router.push('/totem/socio')}>
                    Desconto Sócio
                </div>
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                onClick={() => router.push('/totem/pagamento/debito')}>
                    Débito
                </div>
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                onClick={() => router.push('/totem/pagamento/credito')}>
                    Crédito
                </div>
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                onClick={() => router.push('/totem/pagamento/pix')}>
                    PIX
                </div>
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                onClick={() => router.push('/totem')}>
                    Voltar
                </div>
            </div>
            <Footer />
        </div>
    )
}
