import { View, Text, TouchableHighlight, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { iniciarBanco, salvarOperacao, buscarOperacoes } from '@/db/database';
import obterCotacao from '../services/brapiService'

export default function HomeScreen() {

  const [ticker, setTicker] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [valorCompra, setValorCompra] = useState('');
  const [naoExisteTicker, setNaoExisteTicker] = useState(false);

  useEffect(()=>{
    iniciarBanco();
  },[]);

  const carregarDados = ()=>{
    const ativos = buscarOperacoes();
    console.log('listaDeAtivos', ativos);
  }
  
  const pegarCotacao = async (ticker:string) => {
    setNaoExisteTicker(false)
    const dados = await obterCotacao(ticker);
    if(!dados) setNaoExisteTicker(true);
    console.log('dados', dados);
  }

  const salvarNoBanco = async (ticker:string, quantidade:string, dataCompra: string, valorCompra:string) => {
    console.log('ticker e preço', ticker, quantidade, dataCompra, valorCompra);
    salvarOperacao(ticker.toUpperCase(),parseInt(quantidade), dataCompra, parseFloat(valorCompra))
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-100">
      <Text className="text-xl font-bold text-cyan-500">
        Caronte Invest! 
      </Text>
      <TextInput
        className='border mt-4 text-center w-48'
        placeholder='Digite o tiker aqui'
        onChangeText={(text)=>setTicker(text)}
      />
      <TextInput
        className='border mt-4 text-center w-48'
        placeholder='Digite a quantidade'
        onChangeText={(text)=>setQuantidade(text)}
      />
      <TextInput
        className='border mt-4 text-center w-48'
        placeholder='Digite a data da compra'
        onChangeText={(text)=>setDataCompra(text)}
      />
      <TextInput
        className='border mt-4 text-center w-48'
        placeholder='Digite o valor da compra'
        onChangeText={(text)=>setValorCompra(text)}
      />
      <TouchableHighlight onPress={()=>pegarCotacao(ticker)}>
        <Text className='bg-zinc-400 rounded-md p-2 text-zinc-100 mt-4'>
          Pegar Cotação 
        </Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=>salvarNoBanco(ticker,quantidade, dataCompra, valorCompra)}>
        <Text className='bg-zinc-400 rounded-md p-2 text-zinc-100 mt-4'>
          Salvar dados
        </Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=>carregarDados()}>
        <Text className='bg-zinc-400 rounded-md p-2 text-zinc-100 mt-4'>
          Buscar Ativos
        </Text>
      </TouchableHighlight>
      {naoExisteTicker && 
        <Text className='text-cyan-500 mt-4'>Ativo não existe</Text>
      }
    </View>
  );
}


