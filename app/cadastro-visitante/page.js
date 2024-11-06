"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import QRCode from "react-qr-code";

import PersonCard from "@/components/PersonCard";
import Link from "next/link";
import AlterarData from "@/components/AlterarData";
import Loading from "@/components/Loading";
import EnviarFotoVisitante from "@/components/EnviarFotoVisitante";
import ModalCadastro from "@/components/ModalCadastro";
import AdicionarPessoa from "@/components/AdicionarPessoa";
import LoadingFacial from "@/components/LoadingFacial";
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

export default function Cadastro() {
  const [token, setToken] = useState([]);
  const [visitantes, setVisitantes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedido, setPedido] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [showAlterarData, setShowAlterarData] = useState(false);
  const [showAdicionarPessoa, setShowAdicionarPessoa] = useState(false);
  const router = useRouter();
  const setResult = (result) => {
    if (result['status'] == 'success') {
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
    alert(result['message']);
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
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setVisitantes(JSON.parse(localStorage.getItem("visitantes")));
    setPedidos(JSON.parse(localStorage.getItem("pedidos")));
  }, [token]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-center py-2">Reconhecimento Facial</h1>
      <nav className="flex justify-center space-x-4 pb-2">
        <a href="/cadastro-visitante" className="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900 bg-slate-300">Pedidos</a>
        <a href="/cadastro-visitante/vinculos" className="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Pessoas Vinculadas</a>
      </nav>
      <div className="bg-slate-100 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      <div className="py-4 mx-4 dark:text-slate-300">
          <p className="text-sm">
            <div>Nesta tela você visualiza os vouchers disponíveis para uso.</div>
            <div>1) Você pode alterar o dia da visita clicando no botão Alterar Data.</div>
            <div>2) Você pode incluir as pessoas que irão com você no dia da visita, elas devem ser inseridas primeiramente na aba Pessoas Vinculadas.</div>
            <div>3) Se você quer trocar a pessoa escolhida basta clicar em cima do nome dela que o sistema perguntará se você quer remover ela.</div>
          </p>
          <p className="text-sm font-bold">
            Se a pessoa que você incluiu ficar na cor rosa, significa que estão faltando dados ou a foto, você pode atualizar na aba Pessoas Vinculadas.</p>
        </div>
      {pedidos?.map(pedido => (<div key={pedido.id} className="py-2">
        <div className="mx-2 rounded shadow-lg border-t border-slate-100 bg-white dark:bg-slate-700 px-2 pt-4 pb-2">
          <QRCode value={pedido.voucher} style={{ height: "150px", maxWidth: "100%", width: "100%" }} />

          <div className="my-2">
            Pedido #: {pedido.id} - Parque {pedido.parque == '1' ? 'Farroupilha' : 'Viamão'} <br />
            Ingressos: {pedido.adultos != '0' ? pedido.adultos + ' Adultos ' : ''}
            {pedido.criancas != '0' ? pedido.criancas + ' Crianças' : ''}
          </div>
          <div className="text-xs">Data da Visita:</div>
          <div className="flex">
            <div className="text-2xl mr-2">{pedido.data.split('-').reverse().join('/')}</div>
            <div
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => {setPedido(pedido); setShowAlterarData(true); }}>
              Alterar Data
            </div>
          </div>
          <div className="font-semibold">Pessoas que utilizarão estes ingressos</div>
          <div className="rounded border shadow-lg mb-2">
            { parseInt(pedido.adultos-pedido.vinculos_adultos)+parseInt(pedido.criancas-pedido.vinculos_criancas) > 0 ?
            <div className="mx-2 mt-2 flex justify-between">
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-1 rounded shadow 
                hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => { setPedido(pedido); setShowAdicionarPessoa(true)}}>
                Adicionar Pessoa
              </button>
              <div>Falta {(pedido.adultos-pedido.vinculos_adultos)+(pedido.criancas-pedido.vinculos_criancas)} vínculo(s)</div>
            </div> : '' }
            {pedido.vinculos.map((vinculo, i) => visitantes.filter(visitante => visitante.cpf == vinculo.vinculo).map(
              (visitante, j) => (<div key={i+j} className={`px-4 py-2 mb-1`+(visitante.faceDetail == '1' ? ' bg-green-100' : ' bg-red-100')}
              onClick={() => removerPessoa(pedido.id, vinculo.vinculo)}>
                {visitante.nome}
                {visitante.faceDetail == 1 ? '' : <div className="text-red-500 text-xs font-semibold">Facial Pendente (Atualize nas pessoas vinculadas)</div>}
              </div>))) }
            {pedido.vinculos.length == 0 ? <div className="mx-2 text-center py-3">Você deve adicionar as pessoas que irão utilizar os ingressos na data escolhida</div> : ''}
          </div>

        </div>
      </div>)
      )}
      </div>
      <div className="m-4 bg-slate-100">
          <div
              className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => router.back()}
          >
              Voltar
          </div>
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
  )
}
