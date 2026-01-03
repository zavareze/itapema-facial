"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Quantidade from "@/components/Quantidade";
import ModalCPF from "@/components/ModalCPF";
import ModalFormaPagamento from "@/components/ModalFormaPagamento";
import ModalPix from "@/components/ModalPix";
import ModalCartao from "@/components/ModalCartao";
import ModalCadastro from "@/components/ModalCadastro";
import Loading from "@/components/Loading";

export default function Selecao() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [parque, setParque] = useState(searchParams.get("parque"));
  const [data, setData] = useState(searchParams.get("data"));
  const [ingressos, setIngressos] = useState([]);
  const [calendario, setCalendario] = useState([]);
  const [produtosEscolhidos, setProdutosEscolhidos] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [showDialogCPF, setShowDialogCPF] = useState(false);
  const [showDialogCadastro, setShowDialogCadastro] = useState(false);
  const [showDialogFormaPagamento, setShowDialogFormaPagamento] =
    useState(false);
  const [showDialogPix, setShowDialogPix] = useState(false);
  const [showDialogCartao, setShowDialogCartao] = useState(false);
  const [total, setTotal] = useState(0);
  const [cpf, setCPF] = useState("");
  const [cpfVerificado, setCPFVerificado] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [pix, setPIX] = useState("");
  const [pedido, setPedido] = useState("");

  const verificaCPF = () => {
    if (total == 0) {
      alert("Você precisa adicionar algum ingresso no pedido antes de avançar");
    } else if (!cpfVerificado) {
      setShowDialogCPF(true);
    } else {
      setShowDialogFormaPagamento(true);
    }
  };
  const retornoCPF = (result) => {
    setCPF(result.cpf);
    if (result.status == "notfound") {
      setShowDialogCadastro(true);
    } else if (result.status == "success") {
      setCPFVerificado(true);
      setShowDialogFormaPagamento(true);
    }
  };
  const geraPedido = async (forma_pagamento) => {
    setCarregando(true);
    const cupom = localStorage.getItem("cupom") || "";
    const res = await fetch(`https://facial.parquedasaguas.com.br/pedido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpf,
        forma_pagamento,
        parque,
        cupom,
        data,
        produtos: produtosEscolhidos,
        voucher,
      }),
    });
    const result = await res.json();
    setCarregando(false);
    if (result.status == "success") {
      setPIX(result.pedido.pix);
      setVoucher(result.pedido.voucher);
      setPedido(result.pedido.id);
      if (result.pedido.forma_pagamento == 5) setShowDialogPix(true);
      if (result.pedido.forma_pagamento == 1) setShowDialogCartao(true);
    }
  };
  const goToPayment = async (forma) => {
    setShowDialogFormaPagamento(false);
    await geraPedido(forma);
  };
  useEffect(() => {
    let total = 0;
    Object.entries(produtosEscolhidos).forEach(([k, v]) => {
      let p = parseFloat(ingressos.filter((x) => x.id == k)?.[0]?.valorPromo);
      console.log(p);
      total += parseFloat(p * v);
    });
    console.log('toaki', total, produtosEscolhidos, ingressos);
    setTotal(total);
  }, [produtosEscolhidos]);

  useEffect(() => {
    let ignore = false;
    setCarregando(true);
    const getCalendario = async () => {
      const res = await fetch(
        `https://facial.parquedasaguas.com.br/ingressos/lista?parque=3&cupom=`+localStorage.getItem("cupom"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (!ignore) {
        setCarregando(false);
        setIngressos(result.produtos);
      }
    };
    getCalendario();
    return () => {
      ignore = true;
    };
  }, []);
  return (
    <div className="isolate bg-white dark:bg-slate-900 px-6 py-8 sm:py-32 lg:px-8">
      {carregando ? <Loading /> : ""}
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
        <img src="/itapema.png" className="w-48 mx-auto" />
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
          Promoções Disponíveis<br />
          Alvorada/RS
        </h2>
      </div>

      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-2 text-black dark:text-gray-300">
          Ingresso para 1 dia (Day Use)
        </h2>
        {ingressos
          .filter((produto) => produto.categoria == 1)
          .map((produto, i) => (
            <div className="text-black dark:text-gray-300" key={i}>
              <div className="font-bold text-md mb-2">
                {produto.titulo}{" "}
                {produto.sub ? (
                  <span className="text-blue-900 dark:text-blue-300 font-normal">
                    {produto.sub}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="flex mb-2">
                <div className="font-bold mx-4 text-xl">
                  R${" "}
                  {parseFloat(produto.valorPromo)?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <Quantidade
                  quantidade={produtosEscolhidos[produto.id] || 0}
                  setQuantidade={(qnt) => {
                    setProdutosEscolhidos((prevState) => ({
                      ...prevState,
                      [produto.id]: qnt,
                    }));
                  }}
                ></Quantidade>
              </div>
            </div>
          ))}
        {ingressos
          .filter((produto) => produto.categoria == 3)
          .map((produto, i) => (
            <div key={i} className="mt-8 mb-4 text-black dark:text-gray-300">
              <div className="font-bold text-md mb-2">
                {produto.titulo}{" "}
                {produto.sub ? (
                  <span className="text-blue-900 dark:text-blue-300 font-normal">
                    {produto.sub}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="text-sm mb-2 text-black dark:text-gray-300">
                {produto.informacoes}
              </div>
              <div className="flex mb-2">
                <div className="font-bold mx-4 text-xl">
                  R${" "}
                  {parseFloat(produto.valorPromo)?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <Quantidade
                  quantidade={produtosEscolhidos[produto.id] || 0}
                  setQuantidade={(qnt) => {
                    setProdutosEscolhidos((prevState) => ({
                      ...prevState,
                      [produto.id]: qnt,
                    }));
                  }}
                ></Quantidade>
              </div>
            </div>
          ))}
        <hr />
        {ingressos.filter((produto) => produto.categoria == 2).length > 0 ? (
          <div className="my-4 text-black">
            <h2 className="text-xl font-bold mt-4 text-black dark:text-gray-300">
              Ingresso Especiais
            </h2>
            <div className="text-sm text-black dark:text-gray-300">
              Apresente documentação comprobatória para obter o benefício.
            </div>
          </div>
        ) : (
          ""
        )}
        {ingressos
          .filter((produto) => produto.categoria == 2)
          .map((produto, i) => (
            <div className="text-black dark:text-gray-300" key={i}>
              <div className="font-bold text-md mb-2">
                {produto.titulo}{" "}
                {produto.sub ? (
                  <span className="text-blue-900 dark:text-blue-300 font-normal">
                    {produto.sub}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="flex mb-2">
                <div className="font-bold mx-4 text-xl ">
                  R${" "}
                  {parseFloat(produto.valorPromo)?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <Quantidade
                  quantidade={produtosEscolhidos[produto.id] || 0}
                  setQuantidade={(qnt) => {
                    setProdutosEscolhidos((prevState) => ({
                      ...prevState,
                      [produto.id]: qnt,
                    }));
                  }}
                ></Quantidade>
              </div>
            </div>
          ))}
        <div
          className="font-bold text-2xl text-center my-4 p-4 border rounded bg-green-100
             dark:bg-green-900 text-black dark:text-gray-300"
        >
          Total R${" "}
          {total?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
        {showDialogCPF ? (
          <ModalCPF
            cpf={cpf}
            setShowModal={(show) => setShowDialogCPF(show)}
            setCarregando={(show) => setCarregando(show)}
            avancar={(result) => retornoCPF(result)}
          />
        ) : (
          ""
        )}
        {showDialogCadastro ? (
          <ModalCadastro
            cpf={cpf}
            setShowModal={(show) => setShowDialogCadastro(show)}
            setCarregando={(show) => setCarregando(show)}
            avancar={(result) => retornoCPF(result)}
          />
        ) : (
          ""
        )}
        {showDialogFormaPagamento ? (
          <ModalFormaPagamento
            total={total}
            setCarregando={(show) => setCarregando(show)}
            setShowModal={(show) => setShowDialogFormaPagamento(show)}
            setFormaPagamento={(forma) => goToPayment(forma)}
          />
        ) : (
          ""
        )}
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
        <div className="mb-2">
          <div
            className="block w-full rounded-md bg-slate-900 dark:bg-slate-600 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
            onClick={() => verificaCPF()}
          >
            Escolher Forma de Pagamento
          </div>
        </div>
        <div className="mb-2">
          <div
            className="block w-full rounded-md bg-slate-900 dark:bg-slate-600 px-2 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
            onClick={() => router.back()}
          >
            Voltar
          </div>
        </div>
        <div className="pt-8 text-center">
          <small>
            Dúvidas Revolution Serviços{" "}
            <a href="//wa.me/5551999984008">(51) 99998-4008</a>
          </small>
        </div>
      </div>
    </div>
  );
}
