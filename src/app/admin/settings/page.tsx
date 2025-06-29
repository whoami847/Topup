
'use client';

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import type { SiteSettings, BannerSetting, SocialLink } from '@/lib/settings';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { resizeImage } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const bannerSchema = z.object({
  id: z.string(),
  src: z.string().min(1, 'Image URL is required.'),
  alt: z.string().min(1, 'Alt text is required.'),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  buttonText: z.string().min(1, 'Button text is required.'),
  buttonLink: z.string().min(1, 'Button link is required.'),
  aiHint: z.string().optional(),
  enabled: z.boolean(),
});

const socialLinkSchema = z.object({
  id: z.enum(['facebook', 'twitter', 'instagram', 'whatsapp']),
  label: z.string(),
  url: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  enabled: z.boolean(),
});

const settingsSchema = z.object({
  banners: z.array(bannerSchema),
  aboutUsPage: z.string().min(1, 'About Us content cannot be empty.'),
  termsPage: z.string().min(1, 'Terms of Service content cannot be empty.'),
  privacyPage: z.string().min(1, 'Privacy Policy content cannot be empty.'),
  tutorialVideoUrl: z.string().url({ message: 'Please enter a valid YouTube embed URL.' }).or(z.literal('')),
  supportPhone: z.string(),
  supportWhatsapp: z.string(),
  socialLinks: z.array(socialLinkSchema),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
        </CardContent>
    </Card>
);

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useAppStore();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: siteSettings || undefined,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'banners',
  });

  React.useEffect(() => {
    if (siteSettings) {
      form.reset(siteSettings);
    }
  }, [siteSettings, form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await updateSiteSettings(data);
      toast({
        title: 'Settings Saved',
        description: 'Your website settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error Saving Settings',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!siteSettings) {
    return <SettingsSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Manage your website's content and appearance from here.</CardDescription>
            </CardHeader>
        </Card>

        <Tabs defaultValue="banners">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="pages">Page Content</TabsTrigger>
            <TabsTrigger value="contact">Contact & Socials</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="banners" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Banners</CardTitle>
                <CardDescription>Manage the banners displayed in the hero section of your homepage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative bg-secondary/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name={`banners.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`banners.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <div className="space-y-4">
                                 <FormField
                                    control={form.control}
                                    name={`banners.${index}.buttonText`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Text</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`banners.${index}.buttonLink`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Link</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-4">
                               <FormField
                                  control={form.control}
                                  name={`banners.${index}.src`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Banner Image</FormLabel>
                                      <FormControl>
                                        <div>
                                          <Image
                                            src={field.value || 'https://placehold.co/400x225.png'}
                                            alt="Banner Preview"
                                            width={400}
                                            height={225}
                                            className="w-full h-auto aspect-video object-cover rounded-md mb-2 border"
                                          />
                                          <Input
                                            type="file"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const dataUrl = await resizeImage(file, 1920, 1080);
                                                field.onChange(dataUrl);
                                              }
                                            }}
                                            className="max-w-xs"
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                             <FormField
                                control={form.control}
                                name={`banners.${index}.enabled`}
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Enabled</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Banner
                            </Button>
                        </div>
                    </Card>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `banner-${Date.now()}`, src: '', alt: 'new banner', title: '', description: '', buttonText: '', buttonLink: '/', enabled: true })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Banner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>Edit the HTML content for your static pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="aboutUsPage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">About Us Page</FormLabel>
                      <FormControl>
                        <Textarea rows={15} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="termsPage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Terms of Service Page</FormLabel>
                      <FormControl>
                        <Textarea rows={15} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Separator />
                <FormField
                  control={form.control}
                  name="privacyPage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Privacy Policy Page</FormLabel>
                      <FormControl>
                        <Textarea rows={15} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Social Links</CardTitle>
                <CardDescription>Update your support contact details and social media presence.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="supportPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Support Phone Number</FormLabel>
                                <FormControl><Input placeholder="+123456789" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="supportWhatsapp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Support WhatsApp Number</FormLabel>
                                <FormControl><Input placeholder="123456789 (without '+')" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                    {form.getValues('socialLinks').map((link, index) => (
                        <div key={link.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] items-end gap-4 p-4 border rounded-lg">
                           <FormItem>
                               <FormLabel>Platform</FormLabel>
                               <Input value={link.label} disabled />
                           </FormItem>
                            <FormField
                                control={form.control}
                                name={`socialLinks.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl><Input placeholder={`https://...${link.id}.com/...`} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`socialLinks.${index}.enabled`}
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 pb-2">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Enabled</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage other general settings for your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="tutorialVideoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tutorial Video URL</FormLabel>
                      <FormControl><Input placeholder="https://www.youtube.com/embed/..." {...field} /></FormControl>
                      <FormDescription>Enter the full embed URL for the YouTube tutorial video.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end sticky bottom-4">
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save All Settings'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
