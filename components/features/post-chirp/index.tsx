"use client";

import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shared/ui/form'
import { Textarea } from '@/components/shared/ui/textarea'
import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { ChirpValidation } from "@/lib/validations/сhirp";
import { Button } from "@/components/shared/ui/button";
import { createChirp } from "@/lib/actions/chirp.action";

interface PostTheardProps {
  userId: string
}

export const PostChirp = ({userId}: PostTheardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ChirpValidation>>({
    resolver: zodResolver(ChirpValidation),
    defaultValues: {
      chirp: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ChirpValidation>) => {
    await createChirp({
      text: values.chirp,
      author: userId,
      path: pathname,
      communityId: null
    })

    router.push("/")
  }

  return (
    <Form {...form}>
    <form
      className='mt-10 flex flex-col justify-start gap-10'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name='chirp'
        render={({ field }) => (
          <FormItem className='flex w-full flex-col gap-3'>
            <FormLabel className='text-base-semibold text-light-2'>
              Content
            </FormLabel>
            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
              <Textarea rows={15} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type='submit' className='bg-primary-500'>
        Post Chirp
      </Button>
    </form>
  </Form>
  )
}
