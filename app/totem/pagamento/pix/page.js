'use client';
//import SkyTef from '@/components/SkyTef';
import Script from 'next/script';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function Pix() {
    const router = useRouter();
    const [valor, setValor] = useState('');
    useEffect(() => {
        setValor(localStorage.getItem('trnAmount'));
    }, []);
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <Header title="Pagamento via Cartão PIX" caption="Leia o QR Code com o aplicativo de seu banco" />
            <div className="text-8xl font-bold text-center border rounded-xl p-4 bg-green-100 my-16 py-8">
                Valor: R$ {parseFloat(valor)?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}
            </div>
            <div className="mt-4 grid grid-cols-8 gap-4 w-full mb-8">
                <div className="rounded-xl bg-white text-center font-bold text-white shadow-xl text-6xl col-span-2 mx-auto my-auto">
                    <img src="https://www.gertec.com.br/wp-content/uploads/2023/05/PPC930_-1000x1812-1.png" width="300" />
                </div>
                <div className="col-span-6">
                    <div className="rounded-xl h-[850px] flex justify-center items-center bg-indigo-600 p-16 text-center font-semibold text-white shadow-xl text-6xl">
                        <div>
                            <img src={''} />
                        </div>
                    </div>
                </div>
                    <div className="rounded-xl bg-red-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-8"
                    onClick={() => {
                        trataColeta(-1);
                        router.push('/totem/pagamento');
                    }}>
                        Cancelar
                    </div>
            </div>
            <Footer />
        </div>
    )
}
