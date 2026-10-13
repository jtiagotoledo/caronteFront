import { Modal, View, Text, Pressable } from 'react-native';

interface ModalResumoProps {
  visible: boolean;
  onClose: () => void;
}

export function ModalResumo({ visible, onClose }: ModalResumoProps) {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-center items-center bg-black/50 px-4'>
        <View className='bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl'>
          <Text className='text-xl mb-6 font-bold text-slate-800'>
            Resumo da operação
          </Text>

          <Pressable 
            onPress={onClose}
            className='bg-slate-900 p-3 rounded-xl items-center mt-4'
          >
            <Text className='text-white font-semibold'>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}