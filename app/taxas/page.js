"use client";
import Loading from "@/components/Loading";
import ModalCartao from "@/components/ModalCartao";
import ModalPix from "@/components/ModalPix";
import { useEffect, useState } from "react";
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
async function cadastro(req, token, onSuccess) {
  const body = JSON.stringify(req);
  const res = await fetch(
    `https://facial.parquedasaguas.com.br/cadastro/titulo`,
    {
      // mode: 'no-cors',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body,
    }
  );
  const json = await res.json();
  onSuccess(json);
  return json;
}
async function getTaxas(token, onSuccess) {
  const res = await fetch(`https://facial.parquedasaguas.com.br/taxas`, {
    // mode: 'no-cors',
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const json = await res.json();
  onSuccess(json);
  return json;
}

export default function Taxas() {
  const [showModal, setShowModal] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [token, setToken] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [taxas, setTaxas] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [showDialogPix, setShowDialogPix] = useState(false);
  const [showDialogCartao, setShowDialogCartao] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [pix, setPIX] = useState("");
  const [pedido, setPedido] = useState("");
  const [total, setTotal] = useState("");

  useEffect(() => {
    getTaxas(localStorage.getItem("token"), async (result) => {
      setTaxas(result);
    });
    setToken(localStorage.getItem("token"));
    setTitulos(JSON.parse(localStorage.getItem("titulo")));
  }, []);
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

  const mostraModal = (person) => {
    setRegistro(person);
    setUpdated(person);
    setShowModal(true);
  };

  const onCadastroSuccess = (response) => {
    if (response["response"] == "success") {
      localStorage.setItem("token", response["token"]);
      localStorage.setItem("titulo", JSON.stringify(response["titulo"]));
      setToken("");
      alert(response["message"]);
    } else {
      let str = response["message"];
      if (response.errors) {
        str += "\n\n";
        for (const [k, v] of Object.entries(response["errors"])) {
          str += v + "\n";
        }
      }
      alert(str);
    }
  };

  const salvar = () => {
    cadastro(updated, token, onCadastroSuccess);
    setShowModal(false);
  };
  
  const checkCarrinho = (matricula, convenio) => {
    return carrinho.filter(
      (x) => x["matricula"] == matricula && x["convenio"] == convenio
    );
  };
  const atualizaTaxas = (registro, convenio, chave, valor) => {
    const idx = carrinho.findIndex(
      (x) => x["matricula"] == registro.matricula && x["convenio"] == convenio
    );
    const newCart = carrinho;
    if (idx > -1) {
      newCart[idx].chave = chave;
    } else {
      newCart.push({
        matricula: registro.matricula,
        nome: registro.nome,
        convenio,
        chave,
        valor,
      });
    }
    setCarrinho(newCart);
    setShowModal(false);
  };
  const montaNomeCarrinho = (convenio, chave) => {
    let texto = "";
    switch (convenio) {
      case 5:
        texto = "Renovação Taxa Sanitária";
        break;
      case 45:
        texto = "Renovação Carteira Social";
        break;
    }
    switch (chave) {
      case "T":
        texto += " Temporada";
        break;
      case "M":
        texto += " 1 Mês";
        break;
      case "1ANO":
        texto += " 1 Ano";
        break;
      case "2ANOS":
        texto += " 2 Anos";
        break;
    }
    return texto;
  };
  const totalCarrinho = () => {
    let total = 0;
    carrinho.map((x) => (total += x.valor * 1));
    return total;
  };
  const apagarItem = (item) => {
    if (
      confirm(
        "Tem certeza que deseja apagar a taxa de " +
          montaNomeCarrinho(item.convenio, item.chave)
      )
    ) {
      const newCart = carrinho.filter(
        (x) =>
          !(x["matricula"] == item.matricula && x["convenio"] == item.convenio)
      );
      setCarrinho(newCart);
    }
  };
  const geraPedido = async (forma_pagamento) => {
    setCarregando(true);
    const res = await fetch(`https://facial.parquedasaguas.com.br/pedido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matricula: titulos?.[0]?.matricula,
        forma_pagamento,
        tarifas: carrinho,
      }),
    });
    const result = await res.json();
    setCarregando(false);
    if (result.status == "success") {
      setPIX(result.pedido.pix);
      setVoucher(result.pedido.voucher);
      setPedido(result.pedido.id);
      setTotal(result.pedido.valor);
      if (result.pedido.forma_pagamento == 5) setShowDialogPix(true);
      if (result.pedido.forma_pagamento == 1) setShowDialogCartao(true);
    }
  }

  return (
    <>
      <div>
        {carregando ? <Loading /> : ""}
        {showDialogPix ? (
          <ModalPix
            pix={pix}
            pedido={pedido}
            voucher={voucher}
            total={total}
            setShowModal={(show) => setShowDialogPix(show)}
            setCarregando={(show) => setCarregando(show)}
          />
        ) : (
          ""
        )}
        {showDialogCartao ? (
          <ModalCartao
            total={total}
            pedido={pedido}
            setCarregando={(show) => setCarregando(show)}
            setShowModal={(show) => setShowDialogCartao(show)}
          />
        ) : (
          ""
        )}
        <button
          type="button"
          className={`block w-full rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm font-semibold text-white 
          shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
          focus-visible:outline-indigo-600 `}
        >
          Reconhecimento facial clique aqui
        </button>
        <h1 className="text-2xl font-bold text-center py-2">
          Renovação de Taxas
        </h1>
        <div className="pb-4 px-2">
          <p className="text-sm">
            Existem duas taxas que devem ser pagas periodicamente são elas taxa
            de carteirinha e Taxa Sanitária. A taxa de carteirinha existe
            renovação por 1 ano ou 2 anos, já a taxa sanitária tem pela validade
            de 1 mês ou 2 meses.
          </p>
        </div>
        {carrinho?.length > 0 ? (<div>
          <h1 className="text-lg font-bold text-center">Carrinho</h1>
          <ul
            role="list"
            className="divide-y sm:grid sm:grid-cols-2 sm:gap-4 cursor-pointer px-2 pb-2 text-sm"
          >
            {carrinho?.map((item) => (
              <li
                key={item.matricula + item.chave}
                onClick={() => apagarItem(item)}
                className={
                  "flex justify-between gap-x-2 p-2 mb-2 bg-yellow-200 cursor-pointer"
                }
              >
                <div>
                  <div>
                    {item.matricula} - {item.nome}
                  </div>
                  <div>{montaNomeCarrinho(item.convenio, item.chave)}</div>
                </div>
                <div>
                  <div>
                    {parseFloat(item.valor)?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div>Apagar</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 px-2">
            <div className="font-bold text-xl text-center p-2 border rounded bg-green-100 dark:bg-green-900">
              Total R${" "}
              {totalCarrinho()?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="mx-4">
              Escolha a forma de pagamento, caso opte por cartão de crédito na
              próxima tela você poderá parcelar
            </div>
            <div
              className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white dark:bg-slate-600 shadow-sm
                  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
              onClick={() => {
                geraPedido(5);
              }}
            >
              PIX
            </div>
            <div
              className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white dark:bg-slate-600 shadow-sm 
                hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
              onClick={() => {
                geraPedido(1);
              }}
            >
              Cartão Crédito
            </div>
          </div>
        </div>) : ''}
        <h1 className="text-lg font-bold text-center">
          Relação de Pessoas no Título
        </h1>
        <ul
          role="list"
          className="divide-y sm:grid sm:grid-cols-3 sm:gap-4 cursor-pointer px-2 pb-2"
        >
          {titulos?.map((person) => (
            <li
              key={person.matricula}
              className={
                "flex justify-between gap-x-6 py-2 mb-2 " +
                (person.facial == "1" ? "bg-green-200" : "bg-red-200")
              }
              onClick={() => {
                mostraModal(person);
              }}
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
                  <div className="text-sm font-semibold leading-6 text-gray-900">
                    {person.nome}
                  </div>
                  <div className="mt-1 truncate text-xs leading-5 text-gray-500">
                    <div>Vencimento Carteirinha:</div>
                    <span className="text-center bg-red-500 text-white font-bold uppercase text-sm px-3 py-1 rounded">
                      {person?.vencimento_carteira}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs leading-5 text-gray-500">
                    <div>Vencimento Taxa Sanitária:</div>
                    <span className="text-center bg-red-500 text-white font-bold uppercase text-sm px-3 py-1 rounded">
                      {person?.vencimento_taxa_sanitaria}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{registro.nome}</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-4 flex-auto">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-2">
                    <div
                      className={`btn-responsive text-center  text-white font-bold uppercase text-sm 
                  px-2 py-3 rounded shadow outline-none mr-1 mb-1 ease-linear transition-all duration-150 +
                  ${
                    registro.carteira_vencida == "0"
                      ? "bg-emerald-500"
                      : checkCarrinho(registro.matricula, 5)
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                    >
                      Carteirinha {registro?.vencimento_carteira}
                    </div>
                    <button
                      className="btn-responsive bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-2 py-3 
                    rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() =>
                        atualizaTaxas(
                          registro,
                          45,
                          "1ANO",
                          taxas?.[2]?.["valor"]
                        )
                      }
                    >
                      Carteirinha 1 Ano R${" "}
                      {parseFloat(taxas?.[2]?.["valor"])?.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </button>
                    <button
                      className="btn-responsive bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-2 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() =>
                        atualizaTaxas(
                          registro,
                          45,
                          "2ANOS",
                          taxas?.[3]?.["valor"]
                        )
                      }
                    >
                      Carteirinha 2 Anos R${" "}
                      {parseFloat(taxas?.[3]?.["valor"])?.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </button>
                    <hr />
                    <div className="btn-responsive text-center bg-red-500 text-white font-bold uppercase text-sm px-2 py-3 rounded shadow outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                      Vencido Taxa Sanitária{" "}
                      {registro?.vencimento_taxa_sanitaria}
                    </div>
                    <button
                      className="btn-responsive bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-2 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() =>
                        atualizaTaxas(registro, 5, "M", taxas?.[0]?.["valor"])
                      }
                    >
                      Taxa Sanitária 1 mês R${" "}
                      {parseFloat(taxas?.[0]?.["valor"])?.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </button>
                    <button
                      className="btn-responsive bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-2 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() =>
                        atualizaTaxas(registro, 5, "T", taxas?.[1]?.["valor"])
                      }
                    >
                      Taxa Sanitária 5 meses R${" "}
                      {parseFloat(taxas?.[1]?.["valor"])?.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center flex-wrap justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => salvar()}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
