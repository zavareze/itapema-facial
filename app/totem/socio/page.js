'use client';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function Totem() {
    const router = useRouter();
    const [erro, setErro] = useState('');
    const localizaAssociado = async (matricula, ticket) => {
        const res = await fetch(`https://facial.parquedasaguas.com.br/estacionamento/socio/${matricula}/${ticket}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            },
        });
        const json = await res.json();
        return json;
    }
    useEffect(() => {
        localStorage.setItem('leitura', '');
        async function keyDownHandler(e) {
            if (e.key === "Enter") {
                console.log(localStorage.getItem('leitura'));
                const ticket_localizado = JSON.parse(localStorage.getItem('ticket_selecionado'));
                const localizado = await localizaAssociado(localStorage.getItem('leitura'), ticket_localizado['ticket']);
                console.log('localizado', localizado);
                if (!localizado.erro) {
                    localStorage.setItem('trnAmount', (localizado.ticket.valor*1).toFixed(2).toString().replace('.', ','));
                    console.log('socio', localizado);
                    setErro('TICKET VALIDADO COM SUCESSO!');
                    setTimeout(() => {
                        router.push('/totem/pagamento');
                    }, 500);
                } else {
                    setErro(localizado.erro);
                }
                localStorage.setItem('leitura', '');
            } else {
                localStorage.setItem('leitura', localStorage.getItem('leitura')+e.key)
            }
            e.preventDefault();
        }
        document.addEventListener("keydown", keyDownHandler);
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, []);
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <Header title="Identificação Associado" caption="Leia o QR Code localizado abaixo e a esquerda" />
            <div className="rounded-xl bg-indigo-600 text-center font-bold text-white shadow-xl text-6xl col-span-2 mx-auto my-8">
                <img src="https://placehold.co/1920x1080" className="w-full h-[639px]" />
            </div>
            {erro != '' ? <div className="rounded-xl bg-red-600 p-8 text-center font-semibold text-white shadow-xl text-6xl my-8">
                {erro}
            </div> : ''}
            <div className="rounded-xl bg-green-600 p-8 text-center font-semibold text-white shadow-xl text-6xl my-8">
                Leia o QR Code de sua Carteirinha de Sócio
            </div>
            <Link href="/totem/pagamento">
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-6xl">
                    Voltar
                </div>
            </Link>
            <Footer />
        </div>
    )
}
