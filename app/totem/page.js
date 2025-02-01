'use client';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function Totem() {
    const router = useRouter();
    const [erro, setErro] = useState('');
    const getTickets = async () => {
        const res = await fetch(`https://facial.parquedasaguas.com.br/estacionamento`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            },
        });
        const json = await res.json();
        if (json['tickets'])
            localStorage.setItem('tickets', JSON.stringify(json['tickets']));
        else 
            localStorage.setItem('tickets', '[]');
        if (json['fechados'])
            localStorage.setItem('fechados', JSON.stringify(json['fechados']));
        else
            localStorage.setItem('fechados', '[]');
    }
    useEffect(() => {
        getTickets();
        if (!localStorage.getItem('agentURL')) {
            localStorage.setItem('agentURL', 'https://127.0.0.1/agente/clisitef');
            localStorage.setItem('cashierOperator', 'Edgar');
            localStorage.setItem('local', 'FARROUPILHA');
            localStorage.setItem('sitefIp', '127.0.0.1');
            localStorage.setItem('storeId', '00037101');
            localStorage.setItem('terminalId', 'TOTEM001');
        }
        localStorage.setItem('leitura', '');
        localStorage.setItem('ticket_selecionado', 'undefined');
        localStorage.setItem('trnAmount', '25,00');
        function keyDownHandler(e) {
            if (e.key === "Enter") {
                console.log(localStorage.getItem('leitura'));
                const tickets_abertos = JSON.parse(localStorage.getItem('tickets'));
                const localizado = tickets_abertos.filter(x => x.ticket == localStorage.getItem('leitura'))?.[0];
                if (localizado) {
                    setErro('');
                    localStorage.setItem('ticket_selecionado', JSON.stringify(localizado));
                    console.log('ticket localizado', localizado);
                    router.push('/totem/pagamento')
                } else {
                    getTickets();
                    setErro('Ticket não localizado, tente novamente');
                }
                localStorage.setItem('leitura', '');
            } else {
                if (e.key == ';')
                    localStorage.setItem('leitura', localStorage.getItem('leitura')+'-')
                else
                if (e.key != 'Shift')
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
            <Header title="Pagamento Estacionamento Visitante" caption="Leia o QR Code localizado abaixo e a esquerda" />
            <div className="rounded-xl bg-indigo-600 text-center font-bold text-white shadow-xl text-6xl col-span-2 mx-auto my-8">
                <img src="https://placehold.co/1920x1080" className="w-full h-[639px]" />
            </div>
            {erro != '' ? <div className="rounded-xl bg-red-600 p-8 text-center font-semibold text-white shadow-xl text-6xl my-8">
                {erro}
            </div> : ''}
            <div className="rounded-xl bg-green-600 p-8 text-center font-semibold text-white shadow-xl text-6xl my-8">
                Leia o QR Code de seu Ticket de Estacionamento no leitor abaixo conforme imagem de exemplo
            </div>
            <Link href="/totem/informar-placa">
                <div className="rounded-xl bg-indigo-600 p-10 text-center font-semibold text-white shadow-xl text-6xl">
                    Prefiro Informar a Placa
                </div>
            </Link>
            <Footer />
        </div>
    )
}
