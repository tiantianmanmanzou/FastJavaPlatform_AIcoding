import React, { type ReactNode } from 'react'
import SearchBar from '../common/SearchBar'
import ActionButton from '../common/ActionButton'
import DataTable from '../common/DataTable'
import Pagination from '../common/Pagination'
import { Card } from '@ui'
import '../../styles/page-shell.scss'
import type { 
  SearchItem, 
  ActionButton as ActionButtonType, 
  TableColumn
} from '../../types'

interface TablePageLayoutProps {
  // 页面标题
  title?: string
  
  // 搜索相关
  showSearch?: boolean
  searchItems?: SearchItem[]
  initialFormData?: Record<string, any>
  onSearch?: (formData: Record<string, any>) => void
  onReset?: () => void
  
  // 操作按钮相关
  showActionButtons?: boolean
  actionButtons?: ActionButtonType[]
  onAction?: (action: string) => void
  
  // 表格相关
  tableData: any[]
  tableColumns: TableColumn[]
  loading?: boolean
  showSelection?: boolean
  showIndex?: boolean
  showTableAction?: boolean
  tableActions?: ActionButtonType[]
  actionWidth?: string | number
  actionFixed?: boolean
  rowKey?: string | ((record: any) => string)
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: any[]) => void
  onRowClick?: (row: any) => void
  onTableAction?: (action: string, row: any) => void
  
  // 分页相关
  showPagination?: boolean
  total?: number
  current?: number
  pageSize?: number
  pageSizes?: number[]
  onPagination?: (page: number, size: number) => void
  
  // 其他内容
  children?: ReactNode
}

const TablePageLayout: React.FC<TablePageLayoutProps> = ({
  title,
  showSearch = true,
  searchItems = [],
  initialFormData,
  onSearch,
  onReset,
  showActionButtons = true,
  actionButtons = [],
  onAction,
  tableData,
  tableColumns,
  loading = false,
  showSelection = false,
  showIndex = true,
  showTableAction = true,
  tableActions = [],
  actionWidth = 200,
  actionFixed = false,
  rowKey = 'id',
  onSelectionChange,
  onRowClick,
  onTableAction,
  showPagination = true,
  total = 0,
  current = 1,
  pageSize = 10,
  pageSizes = [10, 20, 30, 50],
  onPagination,
  children
}) => {
  return (
    <div className="page-shell">
      {title && (
        <header className="page-header">
          <div>
            <p className="page-eyebrow">运营驾驶舱</p>
            <h2>{title}</h2>
          </div>
          {showActionButtons && (
            <div className="page-header-actions">
              <ActionButton buttons={actionButtons} onAction={onAction || (() => {})} />
            </div>
          )}
        </header>
      )}

      <div className="page-stack">
        {(showSearch || (!title && showActionButtons)) && (
          <Card className="page-toolbar">
            <div className="page-toolbar-content">
              {showSearch && (
                <div className="page-search">
                  <SearchBar
                    searchItems={searchItems}
                    initialFormData={initialFormData}
                    onSearch={onSearch || (() => {})}
                    onReset={onReset || (() => {})}
                  />
                </div>
              )}
              {!title && showActionButtons && (
                <div className="page-toolbar-actions">
                  <ActionButton buttons={actionButtons} onAction={onAction || (() => {})} />
                </div>
              )}
            </div>
          </Card>
        )}

        <Card className="page-panel">
          <DataTable
          tableData={tableData}
          columns={tableColumns}
          loading={loading}
          showSelection={showSelection}
          showIndex={showIndex}
          showAction={showTableAction}
          actions={tableActions}
          actionWidth={actionWidth}
          actionFixed={actionFixed}
          rowKey={rowKey}
          onSelectionChange={onSelectionChange}
          onRowClick={onRowClick}
          onAction={onTableAction}
        />
        
        {showPagination && (
          <div className="page-pagination">
            <Pagination
              current={current}
              total={total}
              pageSize={pageSize}
              pageSizes={pageSizes}
              onChange={onPagination || (() => {})}
            />
          </div>
        )}
        </Card>
      </div>

      {/* 其他自定义内容 */}
      {children}
    </div>
  )
}

export default TablePageLayout
