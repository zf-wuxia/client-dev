import iTableView from "../Framework/Components/iTableView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    @property(iTableView)
    tableView: iTableView = null;

    onLoad(): void {
        var arr = [
            {
                value: '罗志祥'
            },
            {
                value: '张学友'
            },
            {
                value: '李克群'
            },
            {
                value: '周润发'
            },
            {
                value: '刘德华'
            }
        ];

        // setTimeout(() => {

            this.tableView.dataSource = arr;

        // }, 200);
        window['kk'] = this;
    }
}
