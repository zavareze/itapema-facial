'use client';
import Footer from '@/components/TotemFooter';
import Header from '@/components/TotemHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import QRCode from "react-qr-code";

export default function Pix() {
    const router = useRouter();
    const [valor, setValor] = useState('');
    const [pix, setPix] = useState('');
    const [erro, setErro] = useState('');
    useEffect(() => {
        const ticket_localizado = JSON.parse(localStorage.getItem('ticket_selecionado')) ?? {};
        ticket_localizado['valor'] = parseFloat(localStorage.getItem('trnAmount')) ?? 0;
        const qrcode_pix = montaPix(ticket_localizado);
        setPix(qrcode_pix);
        setValor(localStorage.getItem('trnAmount'));
    }, []);
    const montaPix = (data) => {
		const chave = '05411490000132';
		const nome = 'ITAPEMA PARK';
		const cidade = 'ALVORADA';
		const referencia = `Estacionamento ${data['ticket']}`;
		const pedido = 'E'+data['id'];
		let valor = data['valor'];
        valor = numberFormat(Math.round(valor * 100) / 100, 2, '.');
        const strBCB = '0014br.gov.bcb.pix';
        const strChave = '01' + padLeft(chave.length, 2, '0') + chave;
        const strReferencia = '02' + padLeft(referencia.length, 2, '0') + referencia;
        const strAdditional = '05' + padLeft(pedido.length, 2, '0') + pedido;
		let pix = '000201';
        pix += '010211';
        pix += '26' + (strBCB.length + strChave.length + strReferencia.length);
        pix += strBCB;
        pix += strChave;
        pix += strReferencia;
        pix += '52040000';
        pix += '5303986';
        pix += '54' + padLeft(valor.length, 2, '0') + valor;
        pix += '5802BR';
        pix += '59' + padLeft(nome.length, 2, '0') + nome;
        pix += '60' + padLeft(cidade.length, 2, '0') + cidade;
        pix += '62' + padLeft(strAdditional.length, 2, '0');
        pix += strAdditional;
        pix += '6304';
		const crc = crc16_ccitt(pix);
		pix += crc;
		return pix;
	}
    const padLeft = (str, length, padChar) => {
        str = String(str);
        while (str.length < length) {
            str = padChar + str;
        }
        return str;
    }
    const numberFormat = (value, decimals, decPoint) => {
        return value.toFixed(decimals).replace('.', decPoint);
    }
	const crc16_ccitt = (data) => {
        let crc = 0xFFFF;
        const polynomial = 0x1021;
        for (let i = 0; i < data.length; i++) {
            crc ^= data.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc <<= 1;
                }
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }
    const verificaPix = async () => {
        const ticket_localizado = JSON.parse(localStorage.getItem('ticket_selecionado'));
        const res = await fetch(`https://facial.parquedasaguas.com.br/estacionamento/verify/${ticket_localizado.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await res.json();
        console.log('verificaPix', json);
        if (json['erro']) {
            setErro(json['erro']);
        } else
        if (json.ticket)
            if (json.ticket.data_liberacao == '0000-00-00 00:00:00') {
                setErro('Pagamento ainda não identificado, aguarde alguns segundos e tente novamente.');
            } else {
                setErro('Pagamento realizado com sucesso! Liberando o estacionamento...');
                reciboPix(json.ticket);
                setTimeout(() => {
                    router.push('/totem/recibo');
                }, 2000);
            }
    }
    const reciboPix = (ticket) => {
        const recibo = `[INICIALIZAR][NEGRITO]ITAPEMA PARK
[!NEGRITO]Endereo: Linha Amadeo, SN, Lote 66
CEP: 90430-090 - Farroupilha/RS
Fone: (054) 3268-1655      17/11/2025 20:03:27
CNPJ: 00.236.866/0001-04                  UF: RS
------------------------------------------------
[EXPANDIDO]RECIBO #${ticket.recibo}
[INICIALIZAR]------------------------------------------------
[CONDENSADO]Estacionamento - TICKET: ${ticket.ticket}
[!CONDENSADO][INICIALIZAR]------------------------------------------------

Data: ${ticket.data_liberacao}
Valor Pago: R$ ${ticket.valor_pago}
Operador: Totem





[CORTAR]`;
        localStorage.setItem('via_cliente', recibo);
    } 
    return (
        <div className="isolate bg-white dark:bg-slate-900 px-6 py-12 sm:py-32 lg:px-8">
            <Header title="Pagamento via Cartão PIX" caption="Leia o QR Code com o aplicativo de seu banco" />
            <div className="text-8xl font-bold text-center border rounded-xl p-4 bg-green-100 my-16 py-8">
                Valor: R$ {parseFloat(valor)?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}
            </div>
            <div className="mt-4 grid grid-cols-8 gap-4 w-full mb-8">
                <div className="col-span-8">
                    <div className="rounded-xl h-[850px] flex justify-center items-center bg-white p-16 text-center font-semibold text-black shadow-xl text-6xl">
                        <div>
                            { !erro && <QRCode value={pix} className="mx-auto my-auto mb-2" size="600" />}
                            {erro && <div className="font-bold text-black my-8">{erro}</div>}
                            <div className="rounded-xl bg-green-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-4"
                                onClick={() => verificaPix()}>
                                Já realizei o pix
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="rounded-xl bg-red-600 p-8 text-center font-semibold text-white shadow-xl text-6xl col-span-8"
                    onClick={() => {
                        router.push('/totem/pagamento');
                    }}>
                        Cancelar
                    </div>
            </div>
            <Footer />
        </div>
    )
}
