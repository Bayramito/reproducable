import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import CeyCeyComponent from './src/Gradient';

const App = () => {
  const [bg, setBg] = useState('hotpink');
  const [active, setActive] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bg,
      }}>
      {/* <ColorPicker
        styles={{
          width: 200,
          height: 15,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#fff',
        }}
        onColorChanged={color => {
          setBg(color);
        }}
      /> */}
      <TouchableOpacity
        style={{marginBottom: 50}}
        onPress={() => setActive(!active)}>
        <Text>BAS</Text>
      </TouchableOpacity>
      <CeyCeyComponent
        text={'HESAP OLUŞTUR'}
        width={200}
        height={50}
        isActive={active}
      />
    </View>
  );
};

export default App;
