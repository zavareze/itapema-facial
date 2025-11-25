'use client';
//import SkyTef from '@/components/SkyTef';
import Script from 'next/script';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
import { useRouter } from 'next/navigation';
import {venda_credito, tef_continuetransaction, trataColeta } from '@/components/SkyTef';
import { useEffect, useRef, useState } from 'react';
export default function Credito() {
    const timer = useRef(null);
    const router = useRouter();
    const [display, setDisplay] = useState('');
    const [valor, setValor] = useState('');
    const [btnCancelar, SetBtnCancelar] = useState(false);
    const [btnConfirmar, SetBtnConfirmar] = useState(false);
    const [btnMenu, SetBtnMenu] = useState(false);
    const updateDisplay = () => {
        return setTimeout(() => {
            console.log('updateDisplay()')
            setDisplay(localStorage.getItem('display'));
            SetBtnCancelar(localStorage.getItem('tef_btn_cancelar'));
            if (localStorage.getItem('via_cliente')) {
                router.push('/totem/recibo');
            } else
                if (localStorage.getItem('tef_btn_confirm') == 'true') {
                    router.push('/totem/pagamento');
                    SetBtnConfirmar(localStorage.getItem('tef_btn_confirm'));
                }
            if (localStorage.getItem('redirect') != '') {
                const redirect = localStorage.getItem('redirect')
                localStorage.setItem('redirect', '');
                router.push(''+redirect);
            }
            timer.current = updateDisplay()
        }, 100);
    }
    useEffect(() => {
        localStorage.setItem('display', '');
        localStorage.setItem('tef_btn_cancelar', false);
        localStorage.setItem('tef_btn_confirm', false);
        localStorage.setItem('tef_input', '');
        localStorage.setItem('tef_input_type', 'text');
        localStorage.setItem('tef_input_length', 1);
        setValor(localStorage.getItem('trnAmount'));
        venda_credito();
        timer.current = updateDisplay();
        return () => { 
            clearTimeout(timer.current); 
        }
    }, []);
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <Header title="Pagamento via Cartão de Crédito" caption="Siga as instruções na maquininha de cartão" />
            <div className="text-8xl font-bold text-center border rounded-xl p-4 bg-green-100 my-16 py-8">Valor: R$ {parseFloat(valor)?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}</div>
            <div className="mt-4 grid grid-cols-8 gap-4 w-full mb-8">
                <div className="rounded-xl bg-white text-center font-bold text-white shadow-xl text-6xl col-span-2 mx-auto my-auto">
                    <img src="https://www.gertec.com.br/wp-content/uploads/2023/05/PPC930_-1000x1812-1.png" width="300" />
                </div>
                <div className="col-span-6">
                    <div className="rounded-xl h-[850px] flex justify-center items-center bg-indigo-600 p-16 text-center font-semibold text-white shadow-xl text-6xl">
                        <div>{display}</div>
                    </div>
                </div>
                { btnCancelar == 'true' ? 
                    <div className="rounded-xl bg-red-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-8"
                    onClick={() => {
                        trataColeta(-1);
                        router.push('/totem/pagamento');
                    }}>
                        Cancelar
                    </div> : ''}
                { btnMenu == 'true' ?
                    <>
                       <div className="rounded-xl bg-green-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-3"
                        onClick={() => trataColeta(0)}>
                            OK
                        </div>
                        <div className="rounded-xl bg-red-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-3"
                        onClick={() => trataColeta(-1)}>
                            Cancelar
                        </div>
                        <div className="rounded-xl bg-orange-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-2"
                        onClick={() => trataColeta(1)}>
                            Voltar
                        </div>
                    </> : ''}
                { btnConfirmar == 'true' ?
                    <>
                       <div className="rounded-xl bg-green-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-4"
                        onClick={() => tef_continuetransaction(0)}>
                            Sim
                        </div>
                        <div className="rounded-xl bg-orange-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-4"
                        onClick={() => tef_continuetransaction(1)}>
                            Não
                        </div>
                    </> : ''}
            </div>
            <Footer />
        </div>
    )
}
