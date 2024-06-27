"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'

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
      <div className="pb-4 px-2">
        <p className="text-sm">
          Insira as pessoas que irão visitar o parque no dia abaixo
        </p>
      </div>
      {pedidos?.map(pedido => (<div key={pedido.id}>
        <div className="mx-2 rounded shadow bg-white dark:bg-slate-700 border-blue-500 px-2 py-1">
          #{pedido.id} - {pedido.parque == '1' ? 'Farroupilha' : 'Viamão'} - {pedido.adultos != '0' ? pedido.adultos + ' Adultos' : ''}
          {pedido.criancas != '0' ? pedido.criancas + ' Crianças' : ''}<br />
        </div>
        <div className="mx-2 text-xs">Data da Visita:</div>
        <div className="flex">
          <div className="mx-2 text-2xl">{pedido.data.split('-').reverse().join('/')}</div>
          <div
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => {setPedido(pedido); setShowAlterarData(true); }}>
            Alterar Data
          </div>
        </div>
        <div className="mx-2 font-semibold">Pessoas que utilizarão estes ingressos</div>
        <div className="border rounded mx-2 border-black">
          { parseInt(pedido.adultos-pedido.vinculos_adultos)+parseInt(pedido.criancas-pedido.vinculos_criancas) > 0 ?
          <div className="mx-2 mt-2">
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => { setPedido(pedido); setShowAdicionarPessoa(true)}}>
              Adicionar Pessoa
            </button>
          </div> : '' }
          {pedido.vinculos.map((vinculo, i) => visitantes.filter(visitante => visitante.cpf == vinculo.vinculo).map(
            (visitante, j) => (<div key={i+j} className={`px-4 py-2 mb-1`+(visitante.faceDetail == '1' ? ' bg-green-100' : ' bg-red-100')}
            onClick={() => removerPessoa(pedido.id, vinculo.vinculo)}>{visitante.nome}{visitante.faceDetail == 1 ? '' : <div className="text-red-500 text-xs font-semibold">Reconhecimento Facial Pendente</div>}</div>))) }
          {pedido.vinculos.length == 0 ? <div className="mx-2 text-center py-3">Ninguém foi selecionado ainda</div> : ''}
        </div>
      </div>)
      )}
      <h1 className="text-lg font-bold text-center">Relação de Pessoas Vinculadas</h1>
      <ul
        role="list"
        className="divide-y sm:grid sm:grid-cols-3 sm:gap-4 cursor-pointer px-2 pb-2"
      >
        {visitantes?.map((person) => (
            <li
              key={person.matricula}
              className={
                "flex justify-between flex-wrap gap-x-6 mx-2 py-2 mb-2 rounded shadow " +
                (person.faceDetail == "1" ? "bg-green-100 dark:bg-slate-700" : "bg-red-100 dark:bg-rose-950")
              }
            >
              <div className="flex min-w-0 gap-x-4 px-2">
                <div className="w-24 flex-none">
                  <img
                    className="w-40 h-32 rounded-lg"
                    src={person.foto}
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                    {person.nome}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-slate-300">
                    {person.cpf}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-slate-300">
                    {person.celular}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-slate-300">
                    {person.email}
                  </p>
                </div>
              </div>
              <div className="px-1 text-xs">
                { person.faceDetail == '1' ? (<div className="text-center text-green-500 font-bold">Reconhecimento Facial Validado!</div>) : '' }
                <div className="grid grid-cols-2 gap-x-4">
                {person.cpf != '' ? <EnviarFotoVisitante cpf={person.cpf} facial={person.faceDetail} setLoading={setLoading} setResult={setResult} /> : (<div className="text-center font-bold text-red-500 col-span-2">Após salvar todos os dados você poderá enviar a Foto para efetuar o reconhecimento facial</div>)}
                </div>
              </div>
            </li>
          ))}
      </ul>
      <div className="m-4">
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
