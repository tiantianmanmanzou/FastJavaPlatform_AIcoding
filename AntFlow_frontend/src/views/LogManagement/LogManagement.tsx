import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/ui/page-header'
import { message } from '@/lib/message'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import SearchBar, { type SearchField } from '@/components/ui/search-bar'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { LogEntry } from '../../types'
import './LogManagement.scss'

const logLevelOptions = ['ERROR', 'WARN', 'INFO', 'DEBUG']
const sourceOptions = [
  { label: '全部', value: '' },
  { label: '用户管理', value: 'user' },
  { label: '系统管理', value: 'system' },
  { label: '数据管理', value: 'data' }
]

const levelColors: Record<string, string> = {
  ERROR: '#ef4444',
  WARN: '#f97316',
  INFO: '#10b981',
  DEBUG: '#3b82f6'
}

interface SearchFilters {
  level: string
  source: string
  dateRangeStart: string
  dateRangeEnd: string
}

const LogManagement: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({ level: '', source: '', dateRangeStart: '', dateRangeEnd: '' })
  const [searchInputs, setSearchInputs] = useState<SearchFilters>(filters)

  const [logList, setLogList] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const [exportDialogVisible, setExportDialogVisible] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [exportFormData, setExportFormData] = useState({
    format: 'xlsx',
    levels: [...logLevelOptions],
    dateRange: ['', ''] as [string, string],
    sources: sourceOptions.filter((item) => item.value).map((item) => item.value)
  })

  const [clearDialogVisible, setClearDialogVisible] = useState(false)
  const [clearLoading, setClearLoading] = useState(false)
  const [clearFormData, setClearFormData] = useState({
    strategy: 'byTime',
    keepDays: '30',
    clearLevels: ['DEBUG', 'INFO']
  })

  const [viewLogVisible, setViewLogVisible] = useState(false)
  const [currentViewLog, setCurrentViewLog] = useState<LogEntry | null>(null)

  useEffect(() => {
    fetchLogList()
  }, [filters, currentPage, pageSize])

  const fetchLogList = () => {
    setLoading(true)
    setTimeout(() => {
      const mockData: LogEntry[] = []
      const levels = ['ERROR', 'WARN', 'INFO', 'DEBUG']
      const sources = ['user', 'system', 'data']
      const messages = [
        '用户登录成功',
        '密码修改',
        '数据导出',
        '系统启动',
        '连接失败',
        '权限验证',
        '数据同步',
        '配置更新'
      ]

      for (let i = 1; i <= 100; i++) {
        mockData.push({
          id: i.toString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          source: sources[Math.floor(Math.random() * sources.length)],
          userId: Math.random() > 0.5 ? `user${Math.floor(Math.random() * 100) + 1}` : undefined
        })
      }

      let filteredData = [...mockData]

      if (filters.level) {
        filteredData = filteredData.filter((item) => item.level === filters.level)
      }

      if (filters.source) {
        filteredData = filteredData.filter((item) => item.source === filters.source)
      }

      if (filters.dateRangeStart && filters.dateRangeEnd) {
        filteredData = filteredData.filter((item) => {
          const timestamp = new Date(item.timestamp).getTime()
          return timestamp >= new Date(filters.dateRangeStart).getTime() && timestamp <= new Date(filters.dateRangeEnd).getTime()
        })
      }

      filteredData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      const paginatedData = filteredData.slice(start, end)

      setLogList(paginatedData)
      setTotal(filteredData.length)
      setLoading(false)
    }, 400)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    setFilters(searchInputs)
  }

  const handleReset = () => {
    const resetState: SearchFilters = { level: '', source: '', dateRangeStart: '', dateRangeEnd: '' }
    setSearchInputs(resetState)
    setFilters(resetState)
    setCurrentPage(1)
  }

  const openExportDialog = () => {
    setExportFormData({
      format: 'xlsx',
      levels: [...logLevelOptions],
      dateRange: ['', ''] as [string, string],
      sources: sourceOptions.filter((item) => item.value).map((item) => item.value)
    })
    setExportDialogVisible(true)
  }

  const openClearDialog = () => {
    setClearFormData({
      strategy: 'byTime',
      keepDays: '30',
      clearLevels: ['DEBUG', 'INFO']
    })
    setClearDialogVisible(true)
  }

  const handleExportLog = async () => {
    if (!exportFormData.format) {
      message.error('请选择导出格式')
      return
    }
    if (exportFormData.levels.length === 0) {
      message.error('至少选择一个日志级别')
      return
    }
    if (!exportFormData.dateRange[0] || !exportFormData.dateRange[1]) {
      message.error('请选择导出时间范围')
      return
    }

    setExportLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      message.success('日志导出成功')
      setExportDialogVisible(false)
    } finally {
      setExportLoading(false)
    }
  }

  const handleClearLog = async () => {
    if (!clearFormData.strategy) {
      message.error('请选择清理策略')
      return
    }
    if (!clearFormData.keepDays) {
      message.error('请选择保留时长')
      return
    }
    setClearLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      message.success('日志清理成功')
      setClearDialogVisible(false)
      fetchLogList()
    } finally {
      setClearLoading(false)
    }
  }

  const handleViewLog = (entry: LogEntry) => {
    setCurrentViewLog(entry)
    setViewLogVisible(true)
  }

  const handlePagination = (page: number) => {
    setCurrentPage(page)
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const paginationLabel = useMemo(() => `第 ${currentPage} / ${totalPages} 页`, [currentPage, totalPages])

  const searchFields: SearchField[] = [
    {
      key: 'level',
      type: 'select',
      placeholder: '全部级别',
      options: logLevelOptions.map((level) => ({ label: level, value: level }))
    },
    {
      key: 'source',
      type: 'select',
      placeholder: '全部来源',
      options: sourceOptions.filter((item) => item.value).map((item) => ({ label: item.label, value: item.value }))
    },
    { key: 'dateRange', type: 'dateRange', placeholder: '时间范围' }
  ]

  const toggleArrayValue = (list: string[], value: string) => {
    if (list.includes(value)) {
      return list.filter((item) => item !== value)
    }
    return [...list, value]
  }

  return (
    <div className="log-management-page space-y-6">
      <PageHeader title="日志管理" />

      <Card>
        <CardContent className="space-y-6">
          <SearchBar
            fields={searchFields}
            values={searchInputs}
            onValuesChange={setSearchInputs}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
            actions={
              <>
                <Button onClick={openExportDialog}>导出日志</Button>
                <Button variant="outline" onClick={openClearDialog}>
                  清理日志
                </Button>
                <Button variant="ghost" onClick={fetchLogList} disabled={loading}>
                  刷新
                </Button>
              </>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">序号</TableHead>
                <TableHead className="w-24 text-center">级别</TableHead>
                <TableHead>消息</TableHead>
                <TableHead className="w-36 text-center">来源</TableHead>
                <TableHead className="w-36 text-center">用户ID</TableHead>
                <TableHead className="w-48 text-center">时间</TableHead>
                <TableHead className="w-32 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-slate-500">
                    数据加载中...
                  </TableCell>
                </TableRow>
              )}
              {!loading && logList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-slate-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                logList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center text-slate-500">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="text-center">
                      <Badge style={{ background: `${levelColors[item.level]}22`, color: levelColors[item.level] || '#475569' }}>
                        {item.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-900">{item.message}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-slate-600">{item.source || '-'}</TableCell>
                    <TableCell className="text-center text-slate-600">{item.userId || '系统'}</TableCell>
                    <TableCell className="text-center text-slate-600">
                      {new Date(item.timestamp).toLocaleString('zh-CN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button variant="link" size="sm" className="px-0" onClick={() => handleViewLog(item)}>
                          查看详情
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <span>{paginationLabel}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePagination(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 导出日志 */}
      <Dialog open={exportDialogVisible} onOpenChange={(open) => setExportDialogVisible(open)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>导出日志</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800">导出格式</Label>
              <Select value={exportFormData.format} onValueChange={(value) => setExportFormData((prev) => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="txt">文本文件 (.txt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800">日志级别</Label>
              <div className="grid grid-cols-2 gap-3">
                {logLevelOptions.map((level) => (
                  <label key={level} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <Checkbox
                      checked={exportFormData.levels.includes(level)}
                      onCheckedChange={() =>
                        setExportFormData((prev) => ({ ...prev, levels: toggleArrayValue(prev.levels, level) }))
                      }
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800">时间范围</Label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={exportFormData.dateRange[0]}
                  onChange={(e) =>
                    setExportFormData((prev) => ({ ...prev, dateRange: [e.target.value, prev.dateRange[1]] }))
                  }
                />
                <Input
                  type="datetime-local"
                  value={exportFormData.dateRange[1]}
                  onChange={(e) =>
                    setExportFormData((prev) => ({ ...prev, dateRange: [prev.dateRange[0], e.target.value] }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800">来源</Label>
              <div className="grid grid-cols-2 gap-3">
                {sourceOptions
                  .filter((item) => item.value)
                  .map((item) => (
                    <label key={item.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <Checkbox
                        checked={exportFormData.sources.includes(item.value)}
                        onCheckedChange={() =>
                          setExportFormData((prev) => ({
                            ...prev,
                            sources: toggleArrayValue(prev.sources, item.value)
                          }))
                        }
                      />
                      {item.label}
                    </label>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogVisible(false)} disabled={exportLoading}>
              取消
            </Button>
            <Button onClick={handleExportLog} disabled={exportLoading}>
              {exportLoading ? '处理中...' : '开始导出'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 清理日志 */}
      <Dialog open={clearDialogVisible} onOpenChange={(open) => setClearDialogVisible(open)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>清理日志</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800">清理策略</Label>
              <Select value={clearFormData.strategy} onValueChange={(value) => setClearFormData((prev) => ({ ...prev, strategy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择策略" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="byTime">按时间清理</SelectItem>
                  <SelectItem value="byLevel">按级别清理</SelectItem>
                  <SelectItem value="bySource">按来源清理</SelectItem>
                  <SelectItem value="all">清理全部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800">保留时长</Label>
              <Select value={clearFormData.keepDays} onValueChange={(value) => setClearFormData((prev) => ({ ...prev, keepDays: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择时长" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">保留7天</SelectItem>
                  <SelectItem value="30">保留30天</SelectItem>
                  <SelectItem value="90">保留90天</SelectItem>
                  <SelectItem value="180">保留180天</SelectItem>
                  <SelectItem value="365">保留1年</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800">清理级别</Label>
              <div className="grid grid-cols-2 gap-3">
                {logLevelOptions.map((level) => (
                  <label key={level} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <Checkbox
                      checked={clearFormData.clearLevels.includes(level)}
                      onCheckedChange={() =>
                        setClearFormData((prev) => ({
                          ...prev,
                          clearLevels: toggleArrayValue(prev.clearLevels, level)
                        }))
                      }
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              ⚠️ 此操作将永久删除日志记录，无法恢复，请谨慎执行。
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialogVisible(false)} disabled={clearLoading}>
              取消
            </Button>
            <Button onClick={handleClearLog} disabled={clearLoading}>
              {clearLoading ? '清理中...' : '确认清理'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 查看详情 */}
      <Dialog
        open={viewLogVisible}
        onOpenChange={(open) => {
          if (!open) {
            setViewLogVisible(false)
            setCurrentViewLog(null)
          } else {
            setViewLogVisible(true)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>日志详情</DialogTitle>
          </DialogHeader>
          {currentViewLog && (
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex gap-2">
                <strong className="text-slate-500">日志ID：</strong>
                <span>{currentViewLog.id}</span>
              </div>
              <div className="flex gap-2">
                <strong className="text-slate-500">级别：</strong>
                <span style={{ color: levelColors[currentViewLog.level] || '#111827', fontWeight: 600 }}>
                  {currentViewLog.level}
                </span>
              </div>
              <div className="flex gap-2">
                <strong className="text-slate-500">来源：</strong>
                <span>{currentViewLog.source}</span>
              </div>
              <div className="flex gap-2">
                <strong className="text-slate-500">用户ID：</strong>
                <span>{currentViewLog.userId || '系统'}</span>
              </div>
              <div className="flex gap-2">
                <strong className="text-slate-500">时间：</strong>
                <span>{new Date(currentViewLog.timestamp).toLocaleString('zh-CN')}</span>
              </div>
              <div>
                <strong className="text-slate-500">消息：</strong>
                <p className="mt-1 whitespace-pre-line rounded-md bg-slate-50 p-3 text-slate-800">{currentViewLog.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => {
              setViewLogVisible(false)
              setCurrentViewLog(null)
            }}
            >
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LogManagement
