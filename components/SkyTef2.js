'use client';
import { useEffect, useState } from "react";

export default function SkyTef({call_tef_status}) {
    const tef_agent_url = 'https://127.0.0.1/agente/clisitef';
    const tef_session_clean = { 
		sitefIp: '127.0.0.1', 
		storeId: '00037101', 
		terminalId: 'REST0001', 
		sessionId: '',
		ret: [], 
		automatedMenu: [],
		continua: 0,
		taxInvoiceNumber: '', 
		taxInvoiceDate: '', 
		taxInvoiceTime: '',
		json: {},
		onFinish: function () {},
		finalizado: true
    };
	const [tef_session, setTefSession] = useState({ 
		sitefIp: '127.0.0.1', 
		//storeId: '00000000', //
		// storeId: '11112222', 
		storeId: '00037101', 
		terminalId: 'REST0001', 
		sessionId: '',
		ret: [], 
		automatedMenu: [],
		continua: 0,
		//trnAdditionalParameters: '[[ParmsClient=1=11037845000178;2=05411490000132]]',
		// trnInitParameters: '[ParmsClient=1=11037845000178;2=05411490000132]',
		// trnInitParameters: '[ParmsClient=1=05411490000132;2=05411490000132]',
		taxInvoiceNumber: '', 
		taxInvoiceDate: '', 
		taxInvoiceTime: '',
		json: {},
		onFinish: function () {},
		finalizado: true
    });
    const [tef_session_last, setTefSessionLast] = useState({});
	const [display, setDisplay] = useState('');
    const getFormData = (object) => {
        const formData = new FormData();
        Object.keys(object).forEach(key => formData.append(key, object[key]));
        return formData;
    }
    const fetchReq = async (method, url, data, callback, callbackError) => {
        try {
			const tef_sess = Object.assign(tef_session, data);
        	const body = method == 'GET' ? null : getFormData(tef_sess);
        	const response = await fetch(url, { body, method });
        	const result = await response.json();
			if (callback) callback(result);
			return result;
		} catch (e) {
			if (callbackError)
				callbackError(e);
		}
    }
	const [tef_debug, setTefDebug] = useState(true);
	const [log, setLog] = useState('');
	const tef_log = (str) => {
		if (tef_debug) {
			console.log(str);
			if (typeof str == 'object')
				setLog(() => log+'JSON: '+JSON.stringify(str)+'\n');
			else
				setLog(() => log+str+'\n');
		}
	}
	const tef_status = () => {
		fetchReq('GET', tef_agent_url+'/state', '', (data) => {
			if (data) {
				let s = '';
				switch(data?.['serviceStatus']) {
					case 0:
						s += 'Versão Agente '+data['serviceVersion']+' - '+data['serviceState'];
						break;
					case 1:
						s += 'Agente Pronto';
						break;
					case 2:
						s += 'IniciaFuncaoSiTefInterativo - Aguardando continua.';
						break;
					case 3:
						s += 'clisitef em andamento - Aguardando continua.';
						break;
					case 4:
						s += 'Aguardando finaliza.';
						break;
				}
				if (data['sessionId'])
					s += ' Sessão Atual '+data['sessionId'];
				tef_log(s);
				setTefSession(() => {tef_session, {sessionId: data['sessionId']}});
			}
		}, (error) => {
			if (error['status'] == 0)
				setTimeout(tef_status, 200);
		});
	}
//TRANSACTION
	const tef_start_transaction = (data) => {
		tef_log('begin tef_start_transaction()');
		setTefSessionLast({})
		let dtx = new Date();
		data['taxInvoiceDate'] = dtx.toLocaleDateString().split('/').reverse().join(''); //data AAAAMMDD
		data['taxInvoiceTime'] = dtx.toLocaleTimeString().replace(/:/g, ''); //hora HHMMSS
		data['cashierOperator'] = localStorage.getItem('cashierOperator');
		if (data['taxInvoiceNumber'] && data['taxInvoiceNumber'] != '')
		data['taxInvoiceNumber'] = data['taxInvoiceNumber'];
		else
		data['taxInvoiceNumber'] = new Date().toISOString().replace(/\D/g, '');
		setTefSession(() => Object.assign(tef_session_clean, data));
		localStorage.setItem('tef_taxInvoiceNumber', tef_session['taxInvoiceNumber']);

		/*
		functionId: 3 == credito
		trnAmount = valor 123 = 1,23
		taxInvoiceNumber = numero recibo
		cashierOperator = colaborador
		automatedMenu = menu automatizado na sequencia com opcoes [1,2,3]
		*/
		var args = {
			sitefIp: tef_session['sitefIp'],
			storeId: tef_session['storeId'],
			terminalId: tef_session['terminalId'],
			automatedMenu: tef_session['automatedMenu'],
			functionId: tef_session['functionId'],
			trnAmount: tef_session['trnAmount'],
			taxInvoiceNumber: tef_session['taxInvoiceNumber'],
			taxInvoiceDate: tef_session['taxInvoiceDate'],
			taxInvoiceTime: tef_session['taxInvoiceTime'],
			cashierOperator: tef_session['cashierOperator'],
			trnAdditionalParameters: tef_session['trnAdditionalParameters'],	
			trnInitParameters: tef_session['trnInitParameters']
		}
		if (args['sitefIp'] == '') {
			alert('OBRIGATÓRIO: Você deve informar o IP do servidor Sitef [sitefIp]');
			return;
		}
		if (args['storeId'] == '') {
			alert('OBRIGATÓRIO: Você deve informar o ID da empresa [storeId]');
			return;
		}
		if (args['terminalId'] == '') {
			alert('OBRIGATÓRIO: Você deve informar o ID do terminal [terminalId]');
			return;
		}
		
		fetchReq('POST', tef_agent_url+'/startTransaction', args, (data) => {
			if (data['serviceStatus'] != 0) {
				tef_log('Agente já se encontra uso: '+data['serviceStatus']+' '+data['serviceMessage']);
			} else if (data['clisitefStatus'] != 10000) {
				tef_log('result tef_start_transaction '+data['clisitefStatus']);
			} else {
				setTefSession({ ...tef_session, ...{continua: 0, sessionId: data['sessionId']}});
				tef_save_session();
				tef_continuetransaction('');
			}
		});
	}
	const tef_continuetransaction = (data) => {
		tef_log('begin tef_continuetransaction()');
		tef_save_session();
		let sessionId = tef_session['sessionId'];
		fetchReq('POST', tef_agent_url+'/continueTransaction', {sessionId, data, taxInvoiceNumber: tef_session['taxInvoiceNumber'], continue: tef_session['continua']}, (data) => {
			if (data['serviceStatus'] != 0) {
				tef_log(data['serviceStatus']+' - '+data['serviceMessage']);
				return;
			}
			if (data['clisitefStatus'] != 10000) {
				let s = '';
				//VERRRRRRRRRRRRRR
				//$('#tef_confirm').hide();
				//VERRRRRRRRRRRRRR
				//$('#tef_display_screen').hide();

				if (data['clisitefStatus'] == 0) {
					s = JSON.stringify(tef_session['ret']);
					s = s.replace(/},{/g,"},<br>{");
					tef_log('end tef_continuetransaction() '+data['clisitefStatus']+' - '+s);
					setTefSession({...tef_session, ...{finalizado: false}});
					tef_finishtransaction(1, false, false);
					//tef_finishtransaction(0, false, false);
				}
				return;
			}
			if (data['commandId'] != 23) {
				// tratamento para nao piscar a tela (refresh)
				lastContents23 = '';
			}
			let tratado = false;
			switch(data['commandId']) {
				case 0:
					var item = {
						id: data['fieldId'],
						value: data['data']
					};
					const ret = tef_session['tef'];
					ret.push(item);
					setTefSession({ ...tef_session, ...{ ret}});
					tef_save_session();
					if (data['fieldId'] == 121)
						tef_log('Cupom Estabelecimento: \n'+data['data']);
	
					if (data['fieldId'] == 122)
						tef_log('Cupom Cliente: \n'+data['data']);
					tef_continuetransaction('');
					break;
				case 1:
				case 2:
				case 3:
				case 4:
				case 15:
					tef_display(data['data'])
					tef_continuetransaction('');
					break;
					
				case 11:
				case 12:
				case 13:
				case 14:
				case 16:
					//tef_log('apaga display? implantar');
					tef_continuetransaction('');
					break;
				case 22:
					//tef_log(data['data']+'\nPressione enter');
					tef_display(data['data'])
					setTimeout(() => {tef_continuetransaction('')}, 1000);
					  break;
				case 23:
					var contents = '1';
					if (lastContents23 != contents) {
						$('#tef_cancelar').show();
						lastContents23 = contents;
					}
					// No comando 23, faz o reset da flag de continuidade, para sensibilizar tratamento de confirmações de cancelamento da clisitef.
					setTimeout(() => { tef_continuetransaction(''); tef_session['continua'] = 0; }, 500);
					  break;
				case 20:
					tef_log('EVENT 20\n'+data['data']);
					if ((tef_session['automatedMenu']) && (tef_session['automatedMenu'].length > 0)) {
						setTefSession({...tef_session, ...{continua: 0}});
						tef_continuetransaction(tef_session['automatedMenu'][0]);
						tef_session['automatedMenu'].shift();
						return;
					}
					tef_display(data['data']);
					//VERRRRRRRRRRRRRR
					//$('#tef_confirm').show();
					break;
				case 21: //METODO 1 A VISTA, 2 Parcelado Loja, 3 Parcelado ADM, ETC.
					//console.log(tef_session);
					if ((tef_session['automatedMenu']) && (tef_session['automatedMenu'].length > 0)) {
						setTefSession({...tef_session, ...{continua: 0}});
						tef_continuetransaction(tef_session['automatedMenu'][0]);
						tef_session['automatedMenu'].shift();
						return;
					}
					/*if (tef_session['subPayment']) {
						tef_session['continua'] = 0;
						tef_continuetransaction(tef_session['subPayment']);
						return;
					}*/
					tef_menu(data);
					break;
				case 22:
					tef_display(data['data']);
					setTefSession({...tef_session, ...{continua: 0}});
					break;
				case 30: //COMPLEXO
					switch (data['fieldId']) {
						case 140:
							if (tef_session['trnDate1']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['trnDate1']);
								return;
							} 
							break;
						case 146: //CANCELAMENTO VALOR
							if (tef_session['trnAmount']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['trnAmount']);
								return;
							}
							break;
						case 500: //Senha Admin
							if (tef_session['adminPassword']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['adminPassword']);
								return;
							}
							break;
						case 505:
							if (tef_session['installments']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['installments']);
								return;
							} 
							break;
						case 506: //DATA BANRICOMPRAS PRÉ DDMMAAAA EM BRANCO = 30 DIAS
							if (tef_session['trnDate']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['trnDate']);
								return;
							} 
							break;
						case 512: //Número Cartão (Digitado)
							if (tef_session['cardNumber']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['cardNumber']);
								return;
							} 
							break;
						case 513: //Vencimento MMAA
							if (tef_session['validThru']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['validThru']);
								return;
							} 
							break;
						case 514: //CV - Código de Autorização Atrás do Cartão
							if (tef_session['cardAut']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['cardAut']);
								return;
							} 
							break;
						case 515: //CANCELAMENTO DATA
						case 2370://DATA TRANSACAO PRÉ AUTORIZACAO
							if (tef_session['trnDate']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['trnDate']);
								return;
							}
							break;
						case 516: //CANCELAMENTO NSU
							if (tef_session['nsu']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['nsu']);
								return;
							}
							break;
						case 30: //SENHA SUPERVISOR
							break;
					}
					switch (data['data']) {
						case 'Forneca o codigo de autorizacao':
							if (tef_session['aut']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['aut']);
								return;
							}
							break;
					}
					tef_menu(data);
					break;
				case 34: //VALOR PRÉ AUTORIZACAO
					switch (data['fieldId']) {
						case 504: //Valor Taxa
							//if (tef_session['adminPassword']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(0);
								return;
							//}
							break;
						default:
							if (tef_session['trnAmount']) {
								setTefSession({...tef_session, ...{continua: 0}});
								tef_continuetransaction(tef_session['trnAmount']);
							} else tef_menu(data);
							break;
					}
					break;
				case 31:
				case 32:
				case 33:
				case 35:
				case 38:
					tef_menu(data);
					break;
				default:
					tef_display(data['data']);
					tef_log('Unknown capture ID '+data['commandId'])
					tef_continuetransaction('');
			}
		});
	}
	const tef_finishtransaction = (confirma, reenviaParametrosSiTef, foraDoFluxo) => {
		tef_log('begin tef_finishtransaction() '+confirma+'|'+reenviaParametrosSiTef+'|'+foraDoFluxo);
		let json = processaTransacao();
		setTefSession({ tef_session, json});
		//console.log('LOG TEF SESSION FINISH', tef_session);
		//tef_log('FINALIZADO SEM FINISH');
		//if (tef_session['functionId'] == 130) {
		setTefSession({...tef_session, ...{confirm_transaction: confirma}});

		tef_save_session();
		var args = { 
			confirm: tef_session['confirm_transaction'],
			taxInvoiceNumber: tef_session['taxInvoiceNumber'],
			taxInvoiceDate: tef_session['taxInvoiceDate'],
			taxInvoiceTime: tef_session['taxInvoiceTime']   
		};
		if (reenviaParametrosSiTef) {
			args['sitefIp'] = tef_session['sitefIp'];
			args['storeId'] = tef_session['storeId'];
			args['terminalId'] = tef_session['terminalId'];
		} else
			args['sessionId'] = tef_session['sessionId'];
		
		//if (tef_session['functionId'] == 110) {
		//	tef_session = tef_session_clean;
		//	tef_save_session();
		//} else {
		if ((tef_session['functionId'] == 130) || (tef_session['functionId'] == 131)) {
			processaTransacoesPendentes();
		} else {
			//console.log('ANTES FETCH FINISH', tef_session);
			fetchReq('POST', tef_agent_url+'/finishTransaction', args, (data) => {
				if (data['serviceStatus'] != 0) {
					tef_log(data.serviceStatus+' - '+data.serviceMessage);
					tef_log('RELOAD PAGE?');
				} else {
					if (foraDoFluxo) {
						tef_log('Estornando transação fora do fluxo');
					}
				}
				fetchReq('POST', '/tef/insertTransaction.php', JSON.stringify(tef_session), (data) => {
					tef_log(data);
					localStorage.setItem('tef_taxInvoiceNumber', '');
					console.log('debug json inserttransaction', json);
					setTefSession({...tef_session, ...{tef_id: data['tef_id']}});
					setTefSessionLast(tef_session);
					setTefSession(() => tef_session_clean);
					tef_save_session();
					if (tef_session_last.onFinish)
						tef_session_last.onFinish(tef_session_last);
					if (json['via_caixa'])
						tef_print(json['via_caixa']);
					if (json['via_cliente'])
						tef_print(json['via_cliente']);
				});
			}, error => { console.log(error)});
		}
	}
	const tef_save_session = () => {
		localStorage.setItem('tef_session', JSON.stringify(tef_session));
	}
	const tef_display = (mensagem) => {
		setDisplay(mensagem);
	}
	const tef_menu = (data) => {
		let mensagem = data['data'];
		if (data['commandId'] == 21)
			mensagem = mensagem.replace(/;/g,'<br />');
		if (data['fieldId'] == 500)
			$('#TEF_INPUT').attr('type', 'password');
		else
			$('#TEF_INPUT').attr('type', 'text');
		$('#tef_cancelar').hide();
		$('#tef_mensagem_menu').html(mensagem);
		$('#TEF_INPUT').val('');
		$('#tef_menu').show();
		$('#TEF_INPUT').select();
		$('#TEF_INPUT').focus();
		$('#TEF_INPUT').attr('maxlength', data['fieldMaxLength']);
		setTimeout(function(){ $('#TEF_INPUT').focus(); }, 100);
	}
	const trataTecla = (evt) => {
		if(evt.keyCode == 13)
			trataColeta(0);
		if (evt.keyCode == 27)
			trataColeta(-1);
	}
	const trataColeta = (cont) => {
		$('#tef_menu').hide();
		setTefSession({...tef_session, ...{continua: cont}});
		tef_continuetransaction($('#TEF_INPUT').val());
	}
	const [transacoes_pendentes, setTransacoesPendentes] = useState({numero_transacoes: 0, transacoes: []});
	const processaTransacoesPendentes = () => {
		let transacao = {};
		let transacoes_pendentes = {numero_transacoes: 0, transacoes: []}
		tef_session['ret'].map(x => {
			switch(x['id']) {
				case 210: 
					transacoes_pendentes['numero_transacoes'] = x['value'];
					break;
				case 160:
					transacao['taxInvoiceNumber'] = x['value'];
					break;
				case 161:
					transacao['numero_identificador'] = x['value'];
					break;
				case 163:
					transacao['taxInvoiceDate'] = x['value'];
					break;
				case 164:
					transacao['taxInvoiceTime'] = x['value'];
					break;
				case 211:
					transacao['codigo_funcao'] = x['value'];
					break;
				case 1319:
					transacao['trnAmount'] = x['value'];
					transacao['data_hora'] = transacao['taxInvoiceDate'].substr(0, 4)+'-'+transacao['taxInvoiceDate'].substr(4, 2)+'-'+transacao['taxInvoiceDate'].substr(6,2);
					transacao['data_hora'] += ' '+transacao['taxInvoiceTime'].substr(0, 2)+':'+transacao['taxInvoiceTime'].substr(2, 2)+':'+transacao['taxInvoiceTime'].substr(4, 2);
					transacao['valor'] = transacao['trnAmount']/100;
					transacoes_pendentes['transacoes'].push(transacao);
					transacao = {};
					break;
		  }
		});
		console.log(transacoes_pendentes);
		if (transacoes_pendentes['numero_transacoes'] > 0) {
			console.log('Existem '+transacoes_pendentes['numero_transacoes']+' transações pendentes no terminal');
			let str = `Foram encontradas transações pendentes no terminal abaixo relacionadas, as mesmas foram canceladas. favor efetuar novamente as transações.
		<table border="1">
		<tr>
			<td>Cupom</td>
			<td>ID</td>
			<td>Data/Hora</td>
			<td>Valor</td>
			<td>Função</td>
		</tr>`;
			for (let i=0;i<transacoes_pendentes['transacoes'].length;i++) {
				let t = transacoes_pendentes['transacoes'][i];
				let dt = t['data_hora'].split(' ');
				str += `
		<tr>
			<td align="center">${t['taxInvoiceNumber']}</td>
			<td align="center">${t['numero_identificador']}</td>
			<td align="center">${dt[0].split('-').reverse().join('/')+' '+dt[1]}</td>
			<td align="right">${number_format(t['trnAmount']/100, 2, ',', '.')}</td>
			<td align="center">${t['codigo_funcao']}</td>
			<td align="center"><a href="javascript:tef_pendente(0, ${i})">Cancelar</a> | <a href="javascript:tef_pendente(1, ${i})">Aprovar</a></td>
		</tr>`;
			}
			str += `</table>`;
			tef_display(str);
		}
	}
	const tef_pendente = (aprovar, itm) => {
		let transacao = transacoes_pendentes['transacoes'][itm];
		let sessionId = tef_session['sessionId'];
		setTefSession(() => tef_session_clean);
		tef_session['sessionId'] = sessionId;
		tef_session['taxInvoiceNumber'] = transacao['taxInvoiceNumber'];
		tef_session['taxInvoiceDate'] = transacao['taxInvoiceDate'];
		tef_session['taxInvoiceTime'] = transacao['taxInvoiceTime'];
		tef_session['onFinish'] = (result) => {
			let data = {
				functionId: 130
			}
			tef_start_transaction(data);
		}
		tef_finishtransaction(aprovar, false, false);
	}
	const consultaTransacao = () => {
		let trnPendente = localStorage.getItem('tef_taxInvoiceNumber');
		if (trnPendente && trnPendente != '') {
			processaTransacoesPendentes();
		}
	}
	const processaTransacao = () => {
		let json = {};
		tef_session['ret'].map(x => {
			switch (x['id']) {
				case 100: //MODALIDADE PAGAMENTO
					json['modalidade_pagamento'] = x['value']; break;
				case 101: //TEXTO MODALIDADE PAGAMENTO
					json['n_modalidade_pagamento'] = x['value']; break;
				case 105: //DATA E HORA TRANSACAO AAAAMMDDHHMMSS
					json['data_transacao'] = x['value']; break;
				case 110: //MODALIDADE CANCELAMENTO
					json['modalidade_cancelamento'] = x['value']; break;
				case 111: //TEXTO MODALIDADE CANCELAMENTO
					json['n_modalidade_cancelamento'] = x['value']; break;
				case 121: //VIA CLIENTE
					json['via_cliente'] = x['value']; break;
				case 122: //VIA CAIXA
					json['via_caixa'] = x['value']; break;
				case 131: //INSTITUICAO PROCESSADORA TRANSACAO
					json['instituicao_processadora'] = x['value']; break;
				case 132: //BANDEIRA CARTAO
					json['bandeira_cartao'] = x['value']; break;
				case 133: //NSU (6 POSICOES)
					json['nsu'] = x['value']; break;
				case 134: //NSU HOST AUTORIZADOR (20 POSICOES)
					json['nsu_autorizador'] = x['value']; break;
				case 135: //AUT (15 POSICOES)
					json['aut'] = x['value']; break;
				case 136: //6 PRIMEIROS DIGITOS CARTÃO
					json['cartao_inicial'] = x['value']; break;
				case 156: //NOME ISTITUICAO
					json['nome_instituicao'] = x['value']; break;
				case 157: //CODIGO ESTABELECIMENTO
					json['codigo_estabelecimento'] = x['value']; break;
				case 158: //CODIGO REDE AUTORIZADORA
					json['rede_autorizadora'] = x['value']; break;
				case 1002: //VALIDADE CARTÃO AAMM
					json['validade_cartao'] = x['value']; break;
				case 1003: //NOME PORTADOR
					json['nome_portador'] = x['value']; break;
				case 1190: //EMBOSSO (4 ULTIMOS DIGITOS CARTÃO)
					json['cartao_final'] = x['value']; break;
				case 2010: //RESPOSTA AUTORIZADOR
					json['resposta_autorizador'] = x['value']; break;
				case 2090: //TIPO CARTÃO (00 MAGNETICO | 03 CHIP | 06 NFC | 99 DIGITADO)
					json['tipo_cartao'] = x['value']; break;
				case 2333: //IDENTIFICACAO TRANSACAO
					json['identificacao_transacao'] = x['value']; break;
			}
		});
		return json;
	} 
	var reimprimir = '';
	const tef_print = (str) => {
		id = Math.floor((Math.random() * 1000) + 1); //Aleatorio de 1 a 1000
		str = '[INICIALIZAR][CONDENSADO]' + str + "\n\n\n\n[CORTAR]";
		reimprimir = str;
		output = '';
		output += "sid="+id;
		output += "&pid=2";
		output += "&installedPrinterName="+localStorage.getItem('impressoraRecibo');
		output += "&tipo_impressora="+localStorage.getItem('impressoraTipo');
		output += "&printerCommands="+escape(str);
		$('#print-comprovante').html(str);
		$('#tef_receipt').show();
		$.post('//impressora.zavareze.com.br/Processador.php',
			output,
			function(data) {
				jsWebClientPrint.print('sid=' + id);
			}
		);	
	}
	const tef_print_close = () => { 
		$('#tef_receipt').hide();
	}
	const automaticTransaction = (data) => {
		if (!data['taxInvoiceNumber'])
			return {error: 'Você deve informar o taxInvoiceNumber'};
		if (!data['functionId'])
			return {error: 'Você deve informar o functionId'};
		if (!data['subPayment'])
			return {error: 'Você deve informar o subPayment'};
		if (!data['trnAmount'])
			return {error: 'Você deve informar o trnAmount'};
		if (!data['installments'])
			return {error: 'Você deve informar o installments'};
		if (!data['trnDate'])
			data['trnDate'] = '';
		if (!data['firstDebit'])
			data['firstDebit'] = false;
		if (data['functionId'] == 3) {
			if (data['installments'] > 1)
				data['subPayment'] = 2; //CRÉDITO PARCELADO LOJA
			else
				data['subPayment'] = 1; //CRÉDITO A VISTA
		}
		if (data['functionId'] == 2) {
			if (data['installments'] == 0)
				data['subPayment'] = 1; //DÉBITO A VISTA
			if (data['installments'] == 1)
				data['subPayment'] = 2; //DEBITO PRÉ 30 DIAS
			if (data['installments'] > 1)		
				data['subPayment'] = 3; //CRÉDITO PARCELADO BANRICOMPRAS
		}
		console.log(data);
		tef_start_transaction(data);
	}
	
	const venda_credito = (trnAmount, taxInvoiceNumber) => {
		const data = {
			functionId: 3, 
			subPayment: 1,
			trnAmount,
			taxInvoiceNumber
		}
		tef_start_transaction(data);
	}
	useEffect(() => {
		let s = JSON.parse(localStorage.getItem('tef_session'));
		if (s)
			setTefSession(() => s);
		/*
		fetchReq('GET', tef_agent_url+'/state', {}).then(data => {
			if (data) {
				let s = '';
				switch(data['serviceStatus']) {
					case 0:
						s += 'Versão Agente '+data['serviceVersion']+' - '+data['serviceState'];
						break;
					case 1:
						s += 'Agente Pronto';
						break;
					case 2:
						s += 'IniciaFuncaoSiTefInterativo - Aguardando continua.';
						break;
					case 3:
						s += 'clisitef em andamento - Aguardando continua.';
						break;
					case 4:
						s += 'Aguardando finaliza.';
						break;
				}
				if (data['sessionId']) {
					s += ' Sessão Atual '+data['sessionId'];
					if (tef_session['sessionId'] != data['sessionId'])
						setTefSession(() => {tef_session, {sessionId: data['sessionId']}});
				}
			}
		});*/
		venda_credito(25, '20241021204601');
	}, []);
	if (call_tef_status)
		tef_status();
    return <div>{log}{display}</div>
}