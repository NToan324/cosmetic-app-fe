import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Grid,
  Chip,
  Divider,
  Container,
  Stack
} from '@mui/material'
import shiftService, { Shift } from '@/services/shift.service'
import { formatDate } from '@/helpers'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'

const ShiftCard = ({ shift }: { shift: Shift }) => {
  const {
    employee_name,
    opening_cash,
    current_cash,
    start_time,
    end_time,
    cash_revenue,
    transfer_revenue,
    order_count,
    note,
    is_closed,
    is_approved
  } = shift

  const cashPercent = Math.min((current_cash / opening_cash) * 100, 100)

  return (
    <Card variant='outlined' sx={{ borderRadius: 3, boxShadow: 1 }}>
      <CardContent>
        <Typography variant='h6' fontWeight={600}>
          Ca làm - {employee_name ? employee_name : employee_name || 'Nhân viên'}
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          Bắt đầu: {formatDate(start_time)}
        </Typography>

        {end_time && (
          <Typography variant='body2' color='text.secondary'>
            Kết thúc: {formatDate(end_time)}
          </Typography>
        )}

        <Box mt={2}>
          <Typography variant='subtitle2' gutterBottom>
            Tiền mặt đầu ca: {opening_cash.toLocaleString()}đ
          </Typography>

          <LinearProgress
            variant='buffer'
            valueBuffer={100}
            value={cashPercent}
            sx={{ height: 10, borderRadius: 5, backgroundColor: '#ff8108' }}
          />

          <Typography variant='body2' color='text.secondary' mt={0.5}>
            Hiện tại: {current_cash.toLocaleString()}đ ({cashPercent.toFixed(1)}%)
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant='body2'>💵 Doanh thu tiền mặt: {cash_revenue.toLocaleString()}đ</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant='body2'>🏦 Chuyển khoản: {transfer_revenue.toLocaleString()}đ</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant='body2'>🧾 Số đơn hàng: {order_count}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2'>📝 Ghi chú: {note || 'Không có'}</Typography>
          </Grid>
        </Grid>

        <Box mt={2} display='flex' gap={1}>
          <Chip label={is_closed ? 'Đã đóng ca' : 'Đang hoạt động'} color={is_closed ? 'error' : 'success'} />
          <Chip label={is_approved ? 'Đã xác nhận' : 'Chưa xác nhận'} color={is_approved ? 'primary' : 'default'} />
        </Box>
      </CardContent>
    </Card>
  )
}

const ShiftPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([])
  const { reload } = useContext(AppContext)

  useEffect(() => {
    const fetchShifts = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return
      try {
        const { data } = await shiftService.getAllShiftsById(accessToken)
        setShifts(data)
      } catch (error) {
        console.error('Error fetching shifts:', error)
      }
    }
    fetchShifts()
  }, [reload])

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant='h5' fontWeight={700} gutterBottom align='left'>
        Danh sách ca làm
      </Typography>

      <Stack spacing={3}>
        {shifts.map((shift) => (
          <ShiftCard key={shift._id} shift={shift} />
        ))}
      </Stack>
    </Container>
  )
}

export default ShiftPage
