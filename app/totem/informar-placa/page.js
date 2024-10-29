'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
export default function Totem() {
    const router = useRouter();
    const [placa, setPlaca] = useState('');
    const [placas, setPlacas] = useState(['XXX-XXXX', 'IVQ-7330', 'IMO-2702', 'INI-1213', 'GKSOSMBOUI', 
    'GKSOSMBOUM', 
    'GKSOSMBOUK', 
    'GKSOSMBOUL']);
    const addDigit = (digit) => {
        if (placa.length < 9)
            setPlaca(x => x+digit);
    }
    const delDigit = () => {
        setPlaca(x => x.slice(0, -1));
    }
    const verificaPlaca = () => {
        if (placas.filter(filtro => filtro.includes(placa)).length == 1) {
            router.push('/totem/pagamento')

        }
    }
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <Header title="Informe a Placa" caption="Digite a Placa do Veículo" />
            <div className="rounded-xl border-2 border-black h-[200px] py-8 text-center font-bold shadow-xl text-9xl my-4">
                {placa}
            </div>
            <div className="h-[300px] text-5xl justify-center items-center my-4 p-4 flex flex-wrap">
                {placas.filter(filtro => filtro.includes(placa)).slice(0, 4).map(x => (
                    <span className="border-2 bg-green-200 rounded-xl p-4 m-4"
                        key={x}
                        onClick={() => setPlaca(x)}>
                        {x}
                    </span>
                ))}
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-10 m-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(x => (
                    <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center"
                    key={x}
                    onClick={() => addDigit(x)}
                    >{x}
                    </div>)
                )}
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-10 m-4">
                {['Q','W','E','R','T','Y','U','I','O','P'].map(x => (
                    <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center"
                    key={x}
                    onClick={() => addDigit(x)}
                    >{x}
                    </div>)
                )}
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-9 m-4">
                {['A','S','D','F','G','H','J','K','L'].map(x => (
                    <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center"
                    key={x}
                    onClick={() => addDigit(x)}
                    >{x}
                    </div>)
                )}
            </div>
            <div className="rounded-xl text-center font-semibold text-6xl grid grid-cols-9 m-4">
                {['Z','X','C','V','B','N','M'].map(x => (
                    <div className="mx-2 p-4 shadow-lg rounded-xl border-2 border-green-500 flex items-center justify-center"
                    key={x}
                    onClick={() => addDigit(x)}
                    >{x}
                    </div>)
                )}
                <div className="m-2 p-4 shadow-lg rounded-xl border-2 col-span-2 border-red-500 flex items-center justify-center"
                    onClick={() => delDigit()}
                    >
                    Apagar
                </div>
            </div>
                <div className="rounded-xl bg-indigo-600 p-8 text-center font-semibold text-white shadow-xl text-6xl my-8"
                onClick={() => verificaPlaca()}>
                    Próximo
                </div>
                <div className="rounded-xl bg-indigo-600 p-8 text-center font-semibold text-white shadow-xl text-6xl my-8"
                onClick={() => router.back()}>
                    Voltar
                </div>
            <Footer />
        </div>
    )
}
