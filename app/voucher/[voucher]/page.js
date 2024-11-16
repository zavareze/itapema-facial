
'use client';
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import AlterarData from "@/components/AlterarData";
import Loading from "@/components/Loading";
import AdicionarPessoa from "@/components/AdicionarPessoa";
import LoadingFacial from "@/components/LoadingFacial";
import EnviarFotoVisitante from "@/components/EnviarFotoVisitante";

const parseJWT = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
};
export default function Voucher(req) {
    const [token, setToken] = useState([]);
    const [pedido, setPedido] = useState({});
    const [visitantes, setVisitantes] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [showAlterarData, setShowAlterarData] = useState(false);
    const [showAdicionarPessoa, setShowAdicionarPessoa] = useState(false);
    const setResult = (result) => {
        if (result['status'] == 'success') {
            if (result['refresh']) {
                getVoucher(false);
            }
            if (result['pedido']) {
                setPedido(result.pedido);
            } else {
                if (result['pedidos']) {
                    result['pedido'] = result['pedidos'].filter(x => x.voucher == pedido.voucher)[0];
                    setPedido(result['pedido']);
                }
            }

          if (result['token']) {
            localStorage.setItem('token', result['token']);
            setToken(result['token']);
          }
          if (result['visitantes']) {
            localStorage.setItem('visitantes', JSON.stringify(result['visitantes']));
            setVisitantes(result['visitantes']);
          }
          if (result['pedidos']) {
            localStorage.setItem('pedidos', JSON.stringify(result['pedidos']));
            setPedidos(result['pedidos']);
          }
        }
    }
    const removerPessoa = async (id, vinculo) => {
        if (confirm("Você deseja remover esta pessoa deste pedido?")) {
          setLoadingFetch(true);
          const res = await fetch(`https://facial.parquedasaguas.com.br/visitante/remover-pessoa`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: localStorage.getItem('token'),
              },
              body: JSON.stringify({ id, vinculo }),
          });
          const result = await res.json();
          setLoadingFetch(false);
          setResult(result);
        }
    }
    const getVoucher = async (ignore) => {
        const res = await fetch(`https://facial.parquedasaguas.com.br/voucher/`+req.params.voucher, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await res.json();
        if (!ignore) {
            if (result.status == 'success') {
                let url = 'https://api.whatsapp.com/send/?text=Olá%2C++Segue+o+link+com+seu+QR+CODE+para+acessar+o+parque.%0A%0A';
                url += 'https%3A%2F%2Fcompre.parquedasaguas.com.br%2Fvoucher%2F'+result?.pedido?.voucher+'+%0A%0A';
                url += 'Ao+chegar+no+parque%2C+o+usuário+apresenta+o+QR+CODE+e+recebe+uma+pulseira+para+acesso+rastreável.+Esta+pulseira+é+de+uso+obrigatório+para+acesso+e+permanência+no+complexo+aquático.%0A%0A';
                url += 'Aproveite+para+seguir+no+instagram+e+ficar+atualizado+sobre+notícias+e+promoções+de+Ingressos%0Ainstagram.com%2F';
                url += result?.pedido?.parque?.instagram;
                result.pedido.shareLink = url
                setResult(result);
            }
        }
    }
    useEffect(() => {
        let ignore = false;
        getVoucher(ignore);
        return () => {
            ignore = true;
        }
    }, []);
    return (
        <div className="isolate bg-white py-4 sm:py-32 lg:px-8">
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
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                    { pedido.cliente == 0 ? 'Recibo Taxas' : 'Voucher' }
                </h2>
            </div>
            <div className="mx-4 text-xl font-bold text-black">
                {pedido.cliente == 0 ? 'Parque das Águas' : pedido?.parque?.nome}
            </div>
            <div className="mx-4 text-sm">
                <div>{pedido.cliente == 0 ? 'Linha Amadeo - Lote 66 - Próximo a Empresa SUL PET - Farroupilha - RS' :pedido.parque?.endereco}</div>
                <div>{pedido.cliente == 0 ? '(54) 3261-8599| (54) 99167-7490| (54) 99675-3942' :pedido.parque?.telefone}</div>
            </div>
            <hr />
            {pedido.status == '2' && pedido.cliente > 0 ? (
                <div>
                    <div className="w-full h-50 mx-auto p-2 bg-white-900">
                        <QRCode value={req.params.voucher} style={{ height: "150px", maxWidth: "100%", width: "100%" }} />
                    </div>
                    <div className="m-4">
                        <a href={pedido.shareLink}
                            className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Compartilhar via Whatsapp
                        </a>
                    </div>
                    { parseInt(pedido.adultos-pedido.vinculos_adultos)+parseInt(pedido.criancas-pedido.vinculos_criancas) > 0 && pedido.cliente > 0 && <div className="m-4">
                        <div
                            className="block w-full rounded-md bg-orange-500 px-3.5 py-2.5 text-center font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Você deve efetuar o reconhecimento facial antes de acessar o parque. Role para baixo para adicionar pessoas no Voucher.
                        </div>
                    </div>}
                </div>
            ) : '' }
            {pedido.status == '3' ? <h1 className="text-2xl text-center py-8 font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                VOUCHER JÁ UTILIZADO
            </h1> : ''}
            {!pedido.status ? <h1 className="text-2xl text-center py-8 font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                CARREGANDO VOUCHER
            </h1> : ''}
            {pedido.status == '1' ? <div className="bg-red-100 rounded text-center mx-4 p-4">
                O pedido não está pago, você precisa efetuar o pagamento ou refazer o pedido. Caso queira verificar com o suporte basta clicar no 
                Whatsapp <a href={'//wa.me/5551999984008?text=Pode+verificar+meu+pedido? ID: '+pedido.id+', em nome de '+pedido.nome}>(51) 99998-4008</a>
            </div> : ''}
            {pedido.status == 2 && pedido.cliente != 0 && pedido.forma_pagamento == '1' ? <div className="bg-red-100 rounded text-center mx-4 p-4">
                Você deve apresentar o documento de identidade e o cartão utilizado nesta compra na hora da retirada das pulseiras de acesso
            </div> : ''}
            <div className="mx-4 text-black">
                <h2 className="text-xl font-bold mt-4">Pedido: #{pedido.id}</h2>
                <div className="text-xs">Data da Visita:</div>
                <div className="flex">
                    <div className="text-2xl mr-2">{pedido.data?.split('-').reverse().join('/')}</div>
                    {pedido.status == 2 ? <div
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => {setPedido(pedido); setShowAlterarData(true); }}>
                    Alterar Data
                    </div> : ''}
                </div>
                <div className="text-sm">Nome: {pedido.nome}</div>
                <div className="text-sm font-bold">Ingressos: </div>
                {pedido?.produtos?.map((p, i) => (<div key={i} className="text-sm">
                    <div>{p.titulo}</div>
                    <div>{p.quantidade}x {(p.valor*1).toLocaleString('pt-BR', { minimumFractionDigits: 2})} = R$ {(p.valor*p.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2})}</div>
                </div>))}
                <div className="font-bold text-center font-xl py-2 bg-gray-100 rounded">
                    Total: R$ {(pedido.valor*1).toLocaleString('pt-BR', { minimumFractionDigits: 2})}
                </div>
            </div>
            { pedido.status == 2 ? <div className="font-semibold mx-4">Pessoas que utilizarão estes ingressos</div> : ''}
          <div className="rounded border shadow-lg mb-2">
            { pedido.status == 2 && parseInt(pedido.adultos-pedido.vinculos_adultos)+parseInt(pedido.criancas-pedido.vinculos_criancas) > 0 ?
            <div className="mx-2 mt-2 flex justify-between">
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-1 rounded shadow 
                hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => { setPedido(pedido); setShowAdicionarPessoa(true)}}>
                Adicionar Pessoa
              </button>
              <div>Falta {(pedido.adultos-pedido.vinculos_adultos)+(pedido.criancas-pedido.vinculos_criancas)} vínculo(s)</div>
            </div> : '' }
            {pedido.status == 2 && pedido.vinculos?.map((vinculo, i) => visitantes.filter(visitante => visitante.cpf == vinculo.vinculo).map(
              (visitante, j) => (<div key={i+j} className={`mx-4 px-2 py-2 mb-1`+(visitante.faceDetail == '1' ? ' bg-green-100' : ' bg-red-100')}
              >
                <div className="flex min-w-0 gap-x-2">
                    <div className="w-20 flex-none">
                    <img
                        className="w-20 h-24 rounded-lg"
                        src={visitante.foto}
                        alt=""
                    />
                    </div>
                    <div className="min-w-0 flex-auto">
                        <div className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                            {visitante.nome} <a onClick={() => removerPessoa(pedido.id, vinculo.vinculo)}> (Remover)</a>
                        </div>
                        <div className="text-red-500 text-xs font-semibold">
                            {visitante.cpf != '' ? <EnviarFotoVisitante cpf={visitante.cpf} facial={visitante.faceDetail} setLoading={setLoading} setResult={setResult} /> : (<div className="text-center font-bold text-red-500 col-span-2">Após salvar todos os dados você poderá enviar a Foto para efetuar o reconhecimento facial</div>)}
                        </div>
                    </div>
                </div>
              </div>))) }
            {pedido.status == 2 && (!pedido.vinculos || pedido.vinculos?.length == 0) ? <div className="mx-2 text-center py-3">Você deve adicionar as pessoas que irão utilizar os ingressos na data escolhida</div> : ''}
          </div>
            <div className="pt-8 text-center">
                <small>
                    Dúvidas Revolution Serviços{" "}
                    <a href={'//wa.me/5551999984008?text=Pode+verificar+meu+pedido? ID: '+pedido.id+', em nome de '+pedido.nome}>(51) 99998-4008</a>
                </small>
            </div>
                {showAlterarData ? <AlterarData 
                id={pedido.id} 
                data={pedido.data} 
                setShowModal={(show) => setShowAlterarData(show)} 
                setLoading={(show) => setLoadingFetch(show)} 
                setResult={(result) => setResult(result)} /> : ''}
            {loadingFetch ? <Loading /> : ''}
            {loading ? <LoadingFacial /> : null}
            {/* {showModalCadastro ? <ModalCadastro person={person} cpf, setShowModal={(show) => setShowModalCadastro(show)} avancar={() => set} />} */}
            {showAdicionarPessoa ? <AdicionarPessoa 
                id={pedido.id}
                visitantes={visitantes}
                setResult={(result) => setResult(result)}
                setLoading={(show) => setLoadingFetch(show)}
                setShowModal={(show) => setShowAdicionarPessoa(show)} /> : ''}
        </div>
    );
}
