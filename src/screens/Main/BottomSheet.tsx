import React, {FC, useRef, useEffect} from 'react';
import {Modal, TouchableWithoutFeedback} from 'react-native';
import * as Animateable from 'react-native-animatable';
import ChatUI from '../ChatUI';
import {RootState} from '../../reducers';
import {connect, DispatchProp} from 'react-redux';
import {View, Dimensions, StyleSheet} from 'react-native';
import UserProfile from '../UserProfile';
import {closeBottomSheet} from '../../actions/app';
import {setCurrentThread} from '../../actions/chats';
import {Portal} from 'react-native-paper';

const dims = Dimensions.get('window');

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<any>;

const BottomSheet: FC<Props> = ({bottomSheet, dispatch}) => {
  const containerRef = useRef<Animateable.View>(null);

  useEffect(() => {
    return () => {
      dispatch(setCurrentThread(''));
    };
  });

  useEffect(() => {
    if (bottomSheet.screen) {
      containerRef.current?.slideInUp(650);
    }
  }, [bottomSheet.screen]);

  const _handleBackgroundPress = () => {
    dispatch(closeBottomSheet());
  };

  const _renderScene = () => {
    switch (bottomSheet.screen) {
      case 'ChatUI':
        return <ChatUI {...bottomSheet.params} />;
      case 'UserProfile':
        return <UserProfile {...bottomSheet.params} />;
    }
  };

  let content = () => (
    <>
      <TouchableWithoutFeedback onPress={_handleBackgroundPress}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      <Animateable.View
        ref={ref => (containerRef.current = ref)}
        style={styles.panelContainer}
        pointerEvents="box-none">
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
          {_renderScene()}
        </View>
      </Animateable.View>
    </>
  );

  if (!bottomSheet.screen) return null;

  return <View style={styles.container}>{content()}</View>;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  panelContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  panel: {
    height: dims.height - 50,
    width: dims.width - dims.width / 2,
    paddingHorizontal: 5,
    backgroundColor: 'rgb(72.0, 32.0, 70.0)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginTop: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

const mapStateToProps = (state: RootState) => ({
  bottomSheet: state.app.bottomSheet,
});

export default connect(mapStateToProps)(BottomSheet);
