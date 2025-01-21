import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial
} from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { IconCollection } from '@/data/icons';
import { TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';

interface IconTypes {
  iconName: string;
  iconSet: string;
  uuid: string;
}

type IconObjTypes = {
  [key: string]:
    | typeof AntDesign
    | typeof Entypo
    | typeof EvilIcons
    | typeof Feather
    | typeof FontAwesome
    | typeof FontAwesome5
    | typeof Fontisto
    | typeof Foundation
    | typeof Ionicons
    | typeof MaterialCommunityIcons
    | typeof MaterialIcons
    | typeof Octicons
    | typeof SimpleLineIcons
    | typeof Zocial;
};

const IconObj: IconObjTypes = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial
};

interface PropsTypes {
  selectedIcon: string;
  iconColor: string;
  iconSize: number;
  backgroundColor: string;
  numColumns: number;
  placeholderText: string;
  placeholderTextColor: string;
  searchTitle?: string;
  iconsTitle?: string;
  textStyle?: StyleProp<TextStyle>;
  flatListStyle?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  onClick: (
    id: string,
    searchText: string,
    iconName: string,
    iconSet: string,
    iconColor: string,
    backgroundColor: string
  ) => void;
}

export default function IconPicker({
  selectedIcon,
  iconColor,
  backgroundColor,
  numColumns,
  placeholderText,
  placeholderTextColor,
  searchTitle,
  iconsTitle,
  onClick,
  textStyle,
  iconSize,
  flatListStyle,
  iconContainerStyle
}: PropsTypes) {
  const [search, setSearch] = useState('');
  const filteredIcons = IconCollection.filter(
    (icon) => icon.iconSet === 'MaterialCommunityIcons'
  ).filter((icon) => {
    if (search === '') return false;
    return icon.iconName.toLowerCase().includes(search.toLowerCase())
  });
  const theme = useTheme();

  const IconRenderer = ({ item }: any) => {
    const IconBoxComponent = IconObj[item.iconSet];
    return (
      <Pressable
        style={{
          ...styles.iconContainer,
          ...{ backgroundColor: theme.colors.surfaceVariant },
          ...(iconContainerStyle as {})
        }}
        onPress={() =>
          onClick(
            item.uuid,
            search,
            item.iconName,
            item.iconSet,
            iconColor,
            backgroundColor
          )
        }
      >
        <IconBoxComponent
          name={item.iconName}
          size={iconSize}
          color={iconColor || '#fff'}
        />
      </Pressable>
    );
  };

  return (
    <>
      {searchTitle && (
        <Text style={{ ...styles.text, ...(textStyle as {}) }}>
          {searchTitle}
        </Text>
      )}
      <View style={tw`flex-row w-full gap-4 items-center`}>
        <TextInput
          onChangeText={setSearch}
          value={search}
          label={'Icon'}
          mode='outlined'
          style={tw`flex-1`}
        />
        <MaterialCommunityIcons
          name={selectedIcon as any}
          size={24}
          color={iconColor}
        />
      </View>
      <View
        style={{
          ...{
            flexWrap: 'wrap',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center'
          }
        }}
      >
        {filteredIcons.map((icon) => (
          <IconRenderer key={icon.uuid} item={icon} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 5,
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 15
  }
});
