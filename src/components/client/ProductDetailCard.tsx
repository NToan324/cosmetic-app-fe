import { formatCurrency, formatDate } from '@/helpers'
import { Card, CardContent, Typography, Grid, Box, Stack } from '@mui/material'

interface ProductDetailCardProps {
  name: string
  description: string
  price: number
  stock_quantity: number
  production_date: string
  expiration_date: string
  image_url: string
}

export default function ProductDetailCard(props: ProductDetailCardProps) {
  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', p: 2, mt: 4 }}>
      <CardContent>
        <Grid container spacing={4}>
          {/* IMAGE */}
          {props.image_url && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
                <img
                  src={props.image_url}
                  alt={props.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 250,
                    objectFit: 'contain',
                    borderRadius: 8,
                    border: '1px solid #eee'
                  }}
                />
              </Box>
            </Grid>
          )}

          {/* INFO */}
          <Grid size={{ xs: 12, md: props.image_url ? 8 : 12 }}>
            <Typography variant='h5' gutterBottom>
              {props.name}
            </Typography>
            <Typography variant='body1' color='text.secondary' gutterBottom>
              {props.description}
            </Typography>

            <Grid container spacing={2} mt={1}>
              <Grid size={{ xs: 6 }}>
                <LabelValue label='Giá' value={formatCurrency(props.price)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <LabelValue label='Số lượng' value={props.stock_quantity} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <LabelValue label='Ngày sản xuất' value={formatDate(props.production_date)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <LabelValue label='Ngày hết hạn' value={formatDate(props.expiration_date)} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

function LabelValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant='subtitle2' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body1'>{value}</Typography>
    </Stack>
  )
}
