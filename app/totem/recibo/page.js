'use client';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { tef_print } from '@/components/SkyTef';
import Head from 'next/head';
import Script from 'next/script';
export default function Totem() {
    const router = useRouter();
    const [recibo, setRecibo] = useState('');

    const imprimirRecibo = () => {
        tef_print(localStorage.getItem('via_cliente'));
        //localStorage.setItem('via_cliente', '');
        //router.push('/totem');
    }
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <Header title="Ticker validado com sucesso, como deseja seu Recibo?" caption="Como quer receber seu recibo?" />
            <div className="mt-24 grid grid-cols-1 gap-4 w-full mb-8">
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                    onClick={() => imprimirRecibo()}>
                        Imprimir Recibo
                </div>
                
                {/*<div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                    onClick={() => router.push('/totem')}>
                        por E-mail
                </div>
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                    onClick={() => router.push('/totem')}>
                        por Whatsapp
                </div>*/}
                <div className="rounded-xl bg-red-600 p-10 text-center font-semibold text-white shadow-xl text-7xl mb-8 col-span-2"
                    onClick={() => {
                        localStorage.setItem('via_cliente', '');
                        router.push('/totem')
                    }}>
                        Sair
                </div>
            </div>
            <Footer />
        </div>
    )
}
