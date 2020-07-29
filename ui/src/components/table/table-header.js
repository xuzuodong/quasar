import QCheckbox from '../checkbox/QCheckbox.js'
import QTh from './QTh.js'

import cache from '../../utils/cache.js'

export default {
  methods: {
    getTableHeader (h) {
      const child = this.getTableHeaderRow(h)

      if (this.loading === true && this.$scopedSlots.loading === void 0) {
        child.push(
          h('tr', { staticClass: 'q-table__progress' }, [
            h('th', {
              staticClass: 'relative-position',
              attrs: { colspan: this.computedColspan }
            }, this.__getProgress(h))
          ])
        )
      }

      return h('thead', child)
    },

    getTableHeaderRow (h) {
      const
        header = this.$scopedSlots.header,
        headerCell = this.$scopedSlots['header-cell']

      if (header !== void 0) {
        return header(this.addTableHeaderRowMeta({
          header: true, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap
        })).slice()
      }

      const child = this.computedCols.map(col => {
        const
          headerCellCol = this.$scopedSlots[`header-cell-${col.name}`],
          slot = headerCellCol !== void 0 ? headerCellCol : headerCell,
          props = {
            col, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap
          }

        return slot !== void 0
          ? slot(props)
          : h(QTh, {
            key: col.name,
            props: { props },
            style: col.headerStyle,
            class: col.headerClasses
          }, col.label)
      })

      if (this.singleSelection === true && this.grid !== true) {
        child.unshift(h('th', { staticClass: 'q-table--col-auto-width' }, [' ']))
      }
      else if (this.multipleSelection === true) {
        child.unshift(h('th', { staticClass: 'q-table--col-auto-width' }, [
          h(QCheckbox, {
            props: {
              color: this.color,
              value: this.someRowsSelected === true
                ? null
                : this.allRowsSelected,
              dark: this.isDark,
              dense: this.dense
            },
            on: cache(this, 'inp', {
              input: val => {
                if (this.someRowsSelected === true) {
                  val = false
                }
                this.__updateSelection(
                  this.computedRows.map(this.getRowKey),
                  this.computedRows,
                  val
                )
              }
            })
          })
        ]))
      }

      return [
        h('tr', {
          style: this.tableHeaderStyle,
          class: this.tableHeaderClass
        }, child)
      ]
    },

    addTableHeaderRowMeta (data) {
      if (this.multipleSelection === true) {
        Object.defineProperty(data, 'selected', {
          get: () => this.someRowsSelected === true
            ? 'some'
            : this.allRowsSelected,
          set: val => {
            if (this.someRowsSelected === true) {
              val = false
            }
            this.__updateSelection(
              this.computedRows.map(this.getRowKey),
              this.computedRows,
              val
            )
          },
          configurable: true,
          enumerable: true
        })
        data.partialSelected = this.someRowsSelected
        data.multipleSelect = true
      }

      return data
    }
  }
}
