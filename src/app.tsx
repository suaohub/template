// @ts-ignore
window.defaultGateway = '/petrel';

export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    console.log('integration bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props: any) {
    console.log('integration mount', props);
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    console.log('integration unmount', props);
  },
};

// export const layout = () => {

//   return {
//     childrenRender:(children:any)=>{
//       return (<>{children}</>)
//     }
//   }

// }
