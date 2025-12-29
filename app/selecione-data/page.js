"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Selecao() {
  // const hoje = new Date('2024-06-08 00:00');
  const searchParams = useSearchParams();
  const [parque, setParque] = useState(searchParams.get("parque"));
  const [cupom, setCupom] = useState(searchParams.get("cupom"));
  const router = useRouter();
  const dias_semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [calendario, setCalendario] = useState([]);
  const [mes, setMes] = useState(0);
  const [calendarioAtual, setCalendarioAtual] = useState([]);
  useEffect(() => {
    let ignore = false;
    if (cupom)
      localStorage.setItem("cupom", cupom);
    else
      localStorage.setItem("cupom", "");
    const getCalendario = async () => {
      const res = await fetch(
        `https://facial.parquedasaguas.com.br/ingressos?parque=` + parque + `&cupom=`+cupom,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (!ignore) {
        // console.log(result);
        setCalendario(result);
        setCalendarioAtual(result[0]);
      }
    };
    getCalendario();
    return () => {
      ignore = true;
    };
  }, [cupom]);
  return (
    <div className="isolate bg-white dark:bg-slate-900 px-6 py-8 sm:py-32 lg:px-8">
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
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Bem vindo ao Thermas Clube Parque das Águas
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Selecione o data da Visita
        </p>
      </div>
      <div className="mx-auto mt-4 max-w-xl sm:mt-10">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <input type="text" placeholder="CUPOM DESCONTO" className="col-span-3 p-3 rounded border text-center" 
            defaultValue={cupom || ""} onBlur={(e) => {
            setCupom(e.target.value);
            if (e.target.value)
              localStorage.setItem("cupom", e.target.value);
            else
              localStorage.setItem("cupom", "");
          }} />
          <div
                className="cursor-pointer mx-auto rounded-md bg-slate-900 dark:bg-slate-600 px-3.5 text-center font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => { }}>
                Aplicar Desconto
              </div>
        </div>
        <div className="grid grid-cols-7">
          <div className="text-center font-bold col-span-7">
            {calendarioAtual["caption"]}
          </div>
          {dias_semana.map((dia, i) => (
            <div
              key={i}
              className="bg-slate-100 dark:bg-slate-600 p-2 rounded text-center mb-1"
            >
              {dia}
            </div>
          ))}
          {calendarioAtual.dias?.map((dia, i) => (
            <div
              key={i}
              className={
                `p-2 rounded text-center mb-1` +
                (dia.aberto
                  ? " cursor-pointer hover:bg-lime-500 hover:dark:bg-lime-900"
                  : " text-slate-300 cursor-not-allowed") +
                (dia.span ? " col-span-" + dia.span : "")
              }
              onClick={() =>
                dia.aberto
                  ? router.push(
                      "/selecione-ingresso?parque=" +
                        parque +
                        "&data=" +
                        dia.data
                    )
                  : false
              }
            >
              {dia.clear ? (
                ""
              ) : (
                <>
                  <div>{dia.caption}</div>
                  {dia.valor ? (
                    <div className="text-xs text-green-900 dark:text-green-300">
                      {parseFloat(dia.valor)?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {!calendarioAtual.dias ? <div>Carregando Calendário...</div> : ""}
        {mes + 1 < calendario.length ? (
        <div className="lg:m-10 mb-10">
        <div
              className="block w-full cursor-pointer rounded-md bg-slate-900 dark:bg-slate-600 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                setMes(() => mes + 1);
                setCalendarioAtual(() => calendario[mes + 1]);
              }}
            >
              Próximo Mês
            </div>
          </div>
        ) : (
          ""
        )}
        {mes > 0 ? (
        <div className="lg:m-10 mb-10">
        <div
              className="block w-full cursor-pointer rounded-md bg-slate-900 dark:bg-slate-600 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                setMes(() => mes - 1);
                setCalendarioAtual(() => calendario[mes - 1]);
              }}
            >
              Mês Anterior
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="lg:m-10 mb-10">
          <Link
            className="block w-full rounded-md bg-slate-900 dark:bg-slate-600 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/"
          >
            Voltar
          </Link>
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
