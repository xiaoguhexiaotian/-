import { Form, FormItem, Input } from 'ant-design-vue'
import { Ref } from 'vue'
import domPage from './domPage'
interface ComponentInfo {
  id: string // 组件枚举值
  componentName: string // 组件名称
  name: string //  组件中文名称
  url: string // 组件调用接口的前缀
}

class Dom {
  // 默认为public属性,可以直接在实例上访问并且修改
  publicData: string = 'publicData'

  // 组件变量
  public ClassInput: any

  public ClassFormDom: any

  // select下拉数据源
  private selectOptions: any
  // 私有属性
  private refData: any // 响应式数据

  private componentInfo: any // 组件信息

  // 实例上存在的
  constructor(componentInfo: ComponentInfo, refData: Ref<any>, type?: string) {
    // refData componentInfo虽然为私有属性但是这里经过赋值之后，实例上的refData componentInfo属性其实是实例的地址的属性。
    this.componentInfo = componentInfo
    this.refData = refData
    this.init()
  }

  // 私有方法：初始化
  private init(): void {
    for (const dom in domPage as any) {
      // 从其他文件引入的组件的this指向当前类，这样拿到的数据就是当前类的内存地址。
      this[dom] = domPage[dom](this)
    }
    this.selectOptions = this.getSelectOptions()
    // 私有方法执行完会返回一个DOM元素，需要用在实例化类的时候，把这个返回值赋给组件变量，这样在外部就可以直接使用ClassInput渲染组件。
    this.ClassInput = this.ClassInputDom()
    this.ClassFormDom = this.FormDom()
  }

  private privateMethod(): void {
    console.log('private method')
  }

  // 模拟调用接口获取数据
  private getSelectOptions() {
    const options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))
    return options
  }

  // 默认为public方法，可以直接在实例上调用
  defaultMethod(): void {
    console.log('default method')
  }

  // class内的DOM元素
  private ClassInputDom = () => {
    return () => {
      return (
        // 当传入的数据是一个响应式数据是，直接在calss内部去进行v-model数据的双向绑定。
        <Input
          placeholder={'v-model双向绑定'}
          v-model:value={this.refData.value.keyWords}
          style={'width: 148px;border-radius: 2px 2px 2px 2px;padding: 0;margin-right: 8px;'}
        />
      )
    }
  }

  //
  private FormDom = () => {
    return () => (
      <Form>
        {this.refData.value.schemas.map((item) => (
          <FormItem
            key={item.field}
            label={item.label}
            help={item.help}
            labelCol={{ span: 3, offset: 12 }}
          >
            {/* 类似v-if的语法，this.InputDom其实就是Input，componentPoprs都可以直接传入 */}
            {item.component == 'input' && (
              <this.InputDom v-model:value={this.refData.value.model[item.field]} />
            )}
            {item.component == 'select' && (
              <this.SelectDom v-model:value={this.refData.value.model[item.field]} />
            )}
          </FormItem>
        ))}
      </Form>
    )
  }

  // 只存在于class，实例上没有
  static test(params: any) {
    console.log('static', params)
  }
}

export { Dom }
