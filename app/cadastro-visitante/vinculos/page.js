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
      <nav class="flex justify-center space-x-4 pb-2">
        <a href="/cadastro-visitante" class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Pedidos</a>
        <a href="/cadastro-visitante/vinculos" class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900 bg-slate-300">Pessoas Vinculadas</a>
      </nav>

      <div className="py-4 mx-4 dark:text-slate-300">
          <p className="text-sm">
            <div>Nesta tela você visualiza e atualiza as pessoas vinculadas a você.</div>
            <div>1) Você pode atualizar os dados clicando em cima do nome da pessoa.</div>
            <div>2) Você pode atualizar o reconhecimmento facial.</div>
          </p>
          <p className="text-sm font-bold">
            Se a pessoa ficar na cor rosa, significa que estão faltando dados ou a foto, elas devem ficar na cor verde para poder utilizar o voucher.</p>
        </div>
      <div className="bg-slate-100">
        <h1 className="text-lg font-bold text-center pt-2">Relação de Pessoas Vinculadas</h1>
        <ul
            role="list"
            className="sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 cursor-pointer px-2"
        >
            {visitantes?.map((person) => (
                <li
                key={person.cliente_id}
                className={
                    "flex justify-between flex-wrap gap-x-6 mx-2 py-2 my-4 rounded shadow-lg " +
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
