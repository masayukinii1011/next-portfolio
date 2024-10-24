"use client";

import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export const formSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "名前を入力してください。",
		})
		.max(50, {
			message: "名前は50文字以内で入力してください。",
		}),
	email: z.string().email({
		message: "メールアドレスを正確に入力してください。",
	}),
	message: z.string().min(1, {
		message: "メッセージを入力してください。",
	}),
});

export default function ContactContent() {
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const sendMessageApi = process.env.NEXT_PUBLIC_SEND_MESSEGE_API;
		if (!sendMessageApi) {
			toast({
				description: "メッセージ送信APIが定義されていません。",
				variant: "destructive",
			});
			return;
		}

		try {
			const res = await fetch(sendMessageApi, {
				method: "POST",
				body: JSON.stringify(values),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				throw new Error(`エラー: ${res.status}`);
			}

			toast({
				description: "メッセージが送信されました。",
			});
		} catch (error) {
			console.error(error);
			toast({
				description: "メッセージの送信に失敗しました。もう一度お試しください。",
				variant: "destructive",
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-bold">Name</FormLabel>
							<FormControl>
								<Input className="bg-slate-100" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-bold">Email</FormLabel>
							<FormControl>
								<Input className="bg-slate-100" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-bold">Message</FormLabel>
							<FormControl>
								<Textarea className="bg-slate-100 min-h-60" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					disabled={form.formState.isSubmitting}
					size="lg"
					className="text-white bg-blue-500 hover:bg-blue-600"
				>
					送信
				</Button>
			</form>
		</Form>
	);
}
