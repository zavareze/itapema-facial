"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'

import PersonCard from "@/components/PersonCard";
import Link from "next/link";
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
  const [registro, setRegistro] = useState({
    matricula: "",
    nome: "",
    cpf: "",
    data_nascimento: "",
    celular: "",
    email: "",
    cidade: "",
    facial: "",
    updated: "",
  });
  const [updated, setUpdated] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUpdated({ ...updated, [name]: value });
  };
  const onUploadSuccess = (response) => {
    setLoading(false);
    if (response['response'] == 'success') {
      localStorage.setItem('token', response['token']);
      localStorage.setItem('visitantes', JSON.stringify(response['visitantes']));
      setToken('');
      setShowModal(false)
      alert(response['message']);
    } else {
      let str = response['message'];
      if (response.errors) {
        str += '\n\n';
        for (const [k, v] of Object.entries(response['errors'])) {
          str += v + '\n';
        }
      }
      alert(str);
    }
  };
  const handleUploadFile = (event) => {
    // console.log('loading file', event.target.files[0]);
    const img = document.createElement('img');
    img.onload = () => {
      const scale = 3200 / img.width < 1000 / img.height ? 3200 / img.width : 1000 / img.height;
      const dst = document.createElement("canvas");
      dst.width = img.width * scale;
      dst.height = img.height * scale;
      const ctx = dst.getContext("2d");
      ctx.drawImage(img, 0, 0, dst.width, dst.height);
      const body = { matricula: registro.matricula, image: dst.toDataURL() };
      // console.log('arquivo carregado e redimensionado', JSON.stringify(body));
      upload(body, token, onUploadSuccess);
      setLoading(true);
      setShowModal(false);
    }
    img.src = window.URL.createObjectURL(event.target.files[0]);
  }
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setVisitantes(JSON.parse(localStorage.getItem("visitantes")));
    setPedidos(JSON.parse(localStorage.getItem("pedidos")));
  }, [token]);
  const mostraModal = (person) => {
    setRegistro(person);
    setUpdated(person);
    setShowModal(true);
  };

  const salvar = () => {
    // cadastro(updated, token, onCadastroSuccess);
    setShowModal(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center py-2">Reconhecimento Facial</h1>
      <div className="pb-4 px-2">
        <p className="text-sm">
          Insira as pessoas que visitarão o parque nos dias abaixo
        </p>
      </div>
      {pedidos?.map(pedido => (<div key={pedido.id}>
        <div className="mx-2 rounded shadow bg-white border-blue-500 px-2 py-1">
          #{pedido.id} - {pedido.parque == '1' ? 'Farroupilha' : 'Viamão'} - {pedido.adultos != '0' ? pedido.adultos + ' Adultos' : ''}
          {pedido.criancas != '0' ? pedido.criancas + ' Crianças' : ''}<br />
        </div>
        <div className="mx-2 text-xs">Data da Visita:</div>
        <div className="flex">
          <div className="mx-2 text-2xl">{pedido.data.split('-').reverse().join('/')}</div>
          <Link
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            href={{
              pathname: '/alterar-data',
              query: {
                id: pedido.id,
                data: pedido.data
              },
            }}>
            Alterar Data
          </Link>
        </div>
        <div className="mx-2">Pessoas que utilizarão estes ingressos</div>
        <div className="mx-2">
          <Link
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            href={{
              pathname: '/adicionar-pessoa',
              query: {
                id: pedido.id,
              },
            }}>
            Adicionar Pessoa
          </Link>
        </div>
        <div className="mx-2 text-center py-3">Ninguém foi selecionado ainda</div>

      </div>)
      )}
      <h1 className="text-lg font-bold text-center">Relação de Pessoas Vinculadas</h1>
      <ul
        role="list"
        className="divide-y sm:grid sm:grid-cols-3 sm:gap-4 cursor-pointer px-2 pb-2"
      >
        {visitantes?.map((person) => (<PersonCard key={person.matricula} person={person} mostraModal={mostraModal} handleUploadFile={handleUploadFile} />))}
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
  )
}
