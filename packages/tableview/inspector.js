'use strict';

Vue.component('tableview-inspector', {
    template: `
    <ui-prop v-prop="target.cell"></ui-prop>
    <ui-prop v-prop="target.content"></ui-prop>
    <ui-prop v-prop="target.scrollModel"></ui-prop>
    <ui-prop v-prop="target.enableTouchEvent"></ui-prop>
    <ui-prop v-prop="target.enableGrid"></ui-prop>
    <ui-prop v-prop="target.horizontalOffsetDirection" v-show="target.scrollModel.value==1"></ui-prop>
    <ui-prop v-prop="target.verticalOffsetDirection" v-show="target.scrollModel.value==0"></ui-prop>
    <ui-prop v-prop="target.enableElastic"></ui-prop>
    <ui-prop v-prop="target.bounceDuration" v-show="target.enableElastic.value"></ui-prop>
    <cc-array-prop :target.sync="target.scrollEvents"></cc-array-prop>
    `,

    props: {
        target: {
            twoWay: true,
            type: Object,
        },
    },
});