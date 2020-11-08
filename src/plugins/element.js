import Vue from 'vue'
// import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {
    Aside,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Checkbox,
    CheckboxGroup,
    Col,
    Container,
    DatePicker,
    Form,
    FormItem,
    Header,
    Input,
    Link,
    Main,
    Menu,
    MenuItem,
    MenuItemGroup,
    Message,
    MessageBox,
    Option,
    Pagination,
    Radio,
    RadioGroup,
    Row,
    Select,
    Submenu,
    Switch,
    Table,
    TableColumn,
    Tag
} from "element-ui";

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Switch)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(DatePicker)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(CheckboxGroup)
Vue.use(Option)
Vue.use(Link)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm